import { Injectable, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OrdersService } from '../orders/orders.service';
import { UpdatePaymentSettingsDto } from './dto/update-payment-settings.dto';
import { CreateRazorpayOrderDto } from './dto/create-razorpay-order.dto';
import { VerifyRazorpayPaymentDto } from './dto/verify-razorpay-payment.dto';
import * as crypto from 'crypto';
const Razorpay = require('razorpay');

const MASKED_SECRET = '••••••••';
const SETTING_ID = 'GATEWAY_CONFIG';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly ordersService: OrdersService,
  ) {}

  /**
   * Ensure default settings record exists in database
   */
  private async getOrCreateSettings() {
    let setting = await this.prisma.paymentSetting.findUnique({
      where: { id: SETTING_ID },
    });

    if (!setting) {
      setting = await this.prisma.paymentSetting.create({
        data: {
          id: SETTING_ID,
          razorpayEnabled: false,
          activeMode: 'TEST',
          testKeyId: '',
          testKeySecret: '',
          liveKeyId: '',
          liveKeySecret: '',
          webhookSecret: '',
        },
      });
    }

    return setting;
  }

  /**
   * Super Admin: Fetch payment settings with secrets masked
   */
  async getSettings() {
    const setting = await this.getOrCreateSettings();
    return {
      id: setting.id,
      razorpayEnabled: setting.razorpayEnabled,
      activeMode: setting.activeMode,
      testKeyId: setting.testKeyId || '',
      hasTestKeySecret: Boolean(setting.testKeySecret && setting.testKeySecret.length > 0),
      testKeySecretMasked: setting.testKeySecret ? MASKED_SECRET : '',
      liveKeyId: setting.liveKeyId || '',
      hasLiveKeySecret: Boolean(setting.liveKeySecret && setting.liveKeySecret.length > 0),
      liveKeySecretMasked: setting.liveKeySecret ? MASKED_SECRET : '',
      webhookSecretMasked: setting.webhookSecret ? MASKED_SECRET : '',
      hasWebhookSecret: Boolean(setting.webhookSecret && setting.webhookSecret.length > 0),
      updatedAt: setting.updatedAt,
      updatedBy: setting.updatedBy,
    };
  }

  /**
   * Super Admin: Update gateway keys and active environment
   */
  async updateSettings(dto: UpdatePaymentSettingsDto, adminUser: any) {
    const existing = await this.getOrCreateSettings();

    const dataToUpdate: any = {};

    if (dto.razorpayEnabled !== undefined) {
      dataToUpdate.razorpayEnabled = dto.razorpayEnabled;
    }
    if (dto.activeMode) {
      dataToUpdate.activeMode = dto.activeMode;
    }
    if (dto.testKeyId !== undefined) {
      dataToUpdate.testKeyId = dto.testKeyId.trim();
    }
    if (dto.testKeySecret !== undefined && dto.testKeySecret !== MASKED_SECRET) {
      dataToUpdate.testKeySecret = dto.testKeySecret.trim();
    }
    if (dto.liveKeyId !== undefined) {
      dataToUpdate.liveKeyId = dto.liveKeyId.trim();
    }
    if (dto.liveKeySecret !== undefined && dto.liveKeySecret !== MASKED_SECRET) {
      dataToUpdate.liveKeySecret = dto.liveKeySecret.trim();
    }
    if (dto.webhookSecret !== undefined && dto.webhookSecret !== MASKED_SECRET) {
      dataToUpdate.webhookSecret = dto.webhookSecret.trim();
    }

    dataToUpdate.updatedBy = adminUser?.name || adminUser?.email || adminUser?.id || 'SUPER_ADMIN';

    await this.prisma.paymentSetting.update({
      where: { id: SETTING_ID },
      data: dataToUpdate,
    });

    return this.getSettings();
  }

  /**
   * Public: Retrieve active public key for user checkout (Secrets never sent!)
   */
  async getPublicConfig() {
    const setting = await this.getOrCreateSettings();
    const isLive = setting.activeMode === 'LIVE';
    const activeKeyId = isLive ? setting.liveKeyId : setting.testKeyId;
    const activeKeySecret = isLive ? setting.liveKeySecret : setting.testKeySecret;

    const isFullyConfigured = Boolean(
      setting.razorpayEnabled &&
      activeKeyId && activeKeyId.trim().length > 4 &&
      activeKeySecret && activeKeySecret.trim().length > 4
    );

    return {
      enabled: isFullyConfigured,
      activeMode: setting.activeMode,
      keyId: isFullyConfigured ? activeKeyId : null,
      currency: 'INR',
    };
  }

  /**
   * Helper: Get active Razorpay credentials
   */
  private async getActiveCredentials() {
    const setting = await this.getOrCreateSettings();
    const isLive = setting.activeMode === 'LIVE';
    const keyId = isLive ? setting.liveKeyId : setting.testKeyId;
    const keySecret = isLive ? setting.liveKeySecret : setting.testKeySecret;

    if (!setting.razorpayEnabled) {
      throw new BadRequestException('Razorpay online payment is currently disabled by administrator.');
    }

    if (!keyId || !keySecret) {
      throw new BadRequestException(`Razorpay credentials for ${setting.activeMode} mode are not configured yet.`);
    }

    return { keyId: keyId.trim(), keySecret: keySecret.trim(), mode: setting.activeMode };
  }

  /**
   * Resident: Create Razorpay Order with authentic amount
   */
  async createRazorpayOrder(dto: CreateRazorpayOrderDto) {
    const { keyId, keySecret, mode } = await this.getActiveCredentials();

    try {
      const razorpay = new Razorpay({
        key_id: keyId,
        key_secret: keySecret,
      });

      // Amount in paise (1 INR = 100 paise)
      const amountInPaise = Math.round(Number(dto.amount) * 100);

      const options = {
        amount: amountInPaise,
        currency: dto.currency || 'INR',
        receipt: dto.receipt || `RCPT_${Date.now()}`,
        notes: dto.notes || {},
      };

      const order = await razorpay.orders.create(options);

      return {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId,
        mode,
      };
    } catch (err: any) {
      this.logger.error(`Razorpay order creation failed: ${err?.message || err}`);
      throw new BadRequestException(
        err?.error?.description || err?.message || 'Failed to initiate Razorpay online order. Please try Cash on Delivery.',
      );
    }
  }

  /**
   * Resident: Verify cryptographic signature and commit order as PAID
   */
  async verifyAndCreateOrder(dto: VerifyRazorpayPaymentDto) {
    const { keySecret } = await this.getActiveCredentials();

    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, orderPayload } = dto;

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      throw new BadRequestException('Incomplete payment verification payload received from payment gateway.');
    }

    // Cryptographic signature assertion: HMAC-SHA256(order_id + "|" + payment_id, secret)
    const generatedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    const isMatch = crypto.timingSafeEqual(
      Buffer.from(generatedSignature, 'utf-8'),
      Buffer.from(razorpaySignature, 'utf-8'),
    );

    if (!isMatch) {
      this.logger.warn(`Signature mismatch for order: ${razorpayOrderId}, payment: ${razorpayPaymentId}`);
      throw new BadRequestException('Payment signature validation failed. Transaction could not be verified.');
    }

    // Attach verified payment details to order payload
    const enrichedPayload = {
      ...orderPayload,
      paymentMethod: 'UPI',
      paymentStatus: 'PAID',
      razorpayOrderId,
      razorpayPaymentId,
    };

    // Execute standard order creation transaction
    return this.ordersService.create(enrichedPayload as any);
  }

  /**
   * Asynchronous Webhook safety net: handles delayed or dropped callbacks
   */
  async handleWebhook(body: any, signature: string) {
    const setting = await this.getOrCreateSettings();
    const webhookSecret = setting.webhookSecret || (setting.activeMode === 'LIVE' ? setting.liveKeySecret : setting.testKeySecret);

    if (webhookSecret && signature) {
      try {
        const bodyString = typeof body === 'string' ? body : JSON.stringify(body);
        const expectedSignature = crypto
          .createHmac('sha256', webhookSecret)
          .update(bodyString)
          .digest('hex');

        if (expectedSignature !== signature) {
          this.logger.warn('Webhook signature mismatch. Event discarded.');
          return { status: 'IGNORED_INVALID_SIGNATURE' };
        }
      } catch (e) {
        this.logger.warn('Could not verify webhook signature:', e);
      }
    }

    const event = body?.event;
    if (event === 'payment.captured' || event === 'order.paid') {
      const payment = body?.payload?.payment?.entity;
      const rzpOrderId = payment?.order_id;
      const rzpPaymentId = payment?.id;

      if (rzpOrderId) {
        // If order already exists with this razorpayOrderId, mark it PAID
        const existingOrder = await this.prisma.order.findFirst({
          where: { razorpayOrderId: rzpOrderId },
        });

        if (existingOrder && existingOrder.paymentStatus !== 'PAID') {
          await this.prisma.order.update({
            where: { id: existingOrder.id },
            data: {
              paymentStatus: 'PAID',
              razorpayPaymentId: rzpPaymentId || existingOrder.razorpayPaymentId,
            },
          });
          this.logger.log(`Webhook updated order #${existingOrder.id} to PAID`);
        }
      }
    }

    return { status: 'OK' };
  }
}

