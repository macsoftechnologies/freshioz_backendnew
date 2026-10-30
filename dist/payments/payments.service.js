"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var PaymentsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const orders_service_1 = require("../orders/orders.service");
const crypto = require("crypto");
const Razorpay = require('razorpay');
const MASKED_SECRET = '••••••••';
const SETTING_ID = 'GATEWAY_CONFIG';
let PaymentsService = PaymentsService_1 = class PaymentsService {
    constructor(prisma, ordersService) {
        this.prisma = prisma;
        this.ordersService = ordersService;
        this.logger = new common_1.Logger(PaymentsService_1.name);
    }
    async getOrCreateSettings() {
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
    async updateSettings(dto, adminUser) {
        const existing = await this.getOrCreateSettings();
        const dataToUpdate = {};
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
    async getPublicConfig() {
        const setting = await this.getOrCreateSettings();
        const isLive = setting.activeMode === 'LIVE';
        const activeKeyId = isLive ? setting.liveKeyId : setting.testKeyId;
        const activeKeySecret = isLive ? setting.liveKeySecret : setting.testKeySecret;
        const isFullyConfigured = Boolean(setting.razorpayEnabled &&
            activeKeyId && activeKeyId.trim().length > 4 &&
            activeKeySecret && activeKeySecret.trim().length > 4);
        return {
            enabled: isFullyConfigured,
            activeMode: setting.activeMode,
            keyId: isFullyConfigured ? activeKeyId : null,
            currency: 'INR',
        };
    }
    async getActiveCredentials() {
        const setting = await this.getOrCreateSettings();
        const isLive = setting.activeMode === 'LIVE';
        const keyId = isLive ? setting.liveKeyId : setting.testKeyId;
        const keySecret = isLive ? setting.liveKeySecret : setting.testKeySecret;
        if (!setting.razorpayEnabled) {
            throw new common_1.BadRequestException('Razorpay online payment is currently disabled by administrator.');
        }
        if (!keyId || !keySecret) {
            throw new common_1.BadRequestException(`Razorpay credentials for ${setting.activeMode} mode are not configured yet.`);
        }
        return { keyId: keyId.trim(), keySecret: keySecret.trim(), mode: setting.activeMode };
    }
    async createRazorpayOrder(dto) {
        const { keyId, keySecret, mode } = await this.getActiveCredentials();
        try {
            const razorpay = new Razorpay({
                key_id: keyId,
                key_secret: keySecret,
            });
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
        }
        catch (err) {
            this.logger.error(`Razorpay order creation failed: ${err?.message || err}`);
            throw new common_1.BadRequestException(err?.error?.description || err?.message || 'Failed to initiate Razorpay online order. Please try Cash on Delivery.');
        }
    }
    async verifyAndCreateOrder(dto) {
        const { keySecret } = await this.getActiveCredentials();
        const { razorpayOrderId, razorpayPaymentId, razorpaySignature, orderPayload } = dto;
        if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
            throw new common_1.BadRequestException('Incomplete payment verification payload received from payment gateway.');
        }
        const generatedSignature = crypto
            .createHmac('sha256', keySecret)
            .update(`${razorpayOrderId}|${razorpayPaymentId}`)
            .digest('hex');
        const isMatch = crypto.timingSafeEqual(Buffer.from(generatedSignature, 'utf-8'), Buffer.from(razorpaySignature, 'utf-8'));
        if (!isMatch) {
            this.logger.warn(`Signature mismatch for order: ${razorpayOrderId}, payment: ${razorpayPaymentId}`);
            throw new common_1.BadRequestException('Payment signature validation failed. Transaction could not be verified.');
        }
        const enrichedPayload = {
            ...orderPayload,
            paymentMethod: 'UPI',
            paymentStatus: 'PAID',
            razorpayOrderId,
            razorpayPaymentId,
        };
        return this.ordersService.create(enrichedPayload);
    }
    async handleWebhook(body, signature) {
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
            }
            catch (e) {
                this.logger.warn('Could not verify webhook signature:', e);
            }
        }
        const event = body?.event;
        if (event === 'payment.captured' || event === 'order.paid') {
            const payment = body?.payload?.payment?.entity;
            const rzpOrderId = payment?.order_id;
            const rzpPaymentId = payment?.id;
            if (rzpOrderId) {
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
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = PaymentsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        orders_service_1.OrdersService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map