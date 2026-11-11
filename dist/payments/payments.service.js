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
    async processOrderRefund(orderId, refundAmountInRupees, reason) {
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
        });
        if (!order) {
            throw new common_1.NotFoundException(`Order #${orderId} not found`);
        }
        const paymentId = order.razorpayPaymentId;
        if (!paymentId) {
            throw new common_1.BadRequestException(`Order #${orderId} has no linked Razorpay Payment ID. Cannot refund via gateway.`);
        }
        const { keyId, keySecret } = await this.getActiveCredentials();
        const razorpay = new Razorpay({
            key_id: keyId,
            key_secret: keySecret,
        });
        const amountToRefund = refundAmountInRupees !== undefined
            ? Math.round(Number(refundAmountInRupees) * 100)
            : Math.round(Number(order.totalAmount || 0) * 100);
        if (amountToRefund <= 0) {
            throw new common_1.BadRequestException('Refund amount must be greater than zero.');
        }
        try {
            this.logger.log(`Initiating Razorpay refund of ₹${amountToRefund / 100} for Payment ${paymentId} (Order #${orderId})`);
            const refund = await razorpay.payments.refund(paymentId, {
                amount: amountToRefund,
                speed: 'optimum',
                notes: {
                    orderId: order.id,
                    reason: reason || 'Order Cancellation Refund',
                    refundedAt: new Date().toISOString(),
                },
            });
            this.logger.log(`Razorpay refund successful! Refund ID: ${refund.id}`);
            await this.prisma.order.update({
                where: { id: orderId },
                data: {
                    paymentStatus: 'REFUNDED',
                    cancelledReason: order.cancelledReason
                        ? `${order.cancelledReason} [REFUND_ID:${refund.id}]`
                        : `Refunded via Razorpay (${refund.id})`,
                },
            });
            return {
                success: true,
                refundId: refund.id,
                amount: amountToRefund / 100,
                status: refund.status,
            };
        }
        catch (err) {
            this.logger.error(`Razorpay refund failed for Order #${orderId}: ${err?.error?.description || err?.message || err}`);
            throw new common_1.BadRequestException(err?.error?.description || err?.message || 'Razorpay gateway refund failed.');
        }
    }
    async createOrderDynamicQr(orderId) {
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
            include: { society: true },
        });
        if (!order) {
            throw new common_1.NotFoundException(`Order #${orderId} not found`);
        }
        const amountInRupees = order.totalAmount || 0;
        const amountInPaise = Math.round(amountInRupees * 100);
        let qrId = null;
        let imageUrl = null;
        let paymentUrl = null;
        let gatewaySource = 'STANDARD_UPI';
        try {
            const setting = await this.getOrCreateSettings();
            const isLive = setting.activeMode === 'LIVE';
            const keyId = isLive ? setting.liveKeyId : setting.testKeyId;
            const keySecret = isLive ? setting.liveKeySecret : setting.testKeySecret;
            if (setting.razorpayEnabled && keyId && keySecret) {
                const razorpay = new Razorpay({
                    key_id: keyId.trim(),
                    key_secret: keySecret.trim(),
                });
                const rzpQr = await razorpay.qrCode.create({
                    type: 'upi_qr',
                    name: `Freshioz #${order.id.slice(-6).toUpperCase()}`,
                    usage: 'single_use',
                    fixed_amount: true,
                    payment_amount: amountInPaise,
                    description: `Fresh Produce Order #${order.id}`,
                    notes: {
                        orderId: order.id,
                        societyName: order.society?.name || 'Freshioz Society',
                        flatNo: order.flatNo || '',
                    },
                });
                if (rzpQr && (rzpQr.image_url || rzpQr.id)) {
                    qrId = rzpQr.id;
                    imageUrl = rzpQr.image_url || null;
                    paymentUrl = rzpQr.payment_url || null;
                    gatewaySource = 'RAZORPAY_DYNAMIC_QR';
                }
            }
        }
        catch (err) {
            this.logger.warn(`Razorpay QR Code API attempt failed, falling back to direct NPCI UPI QR: ${err?.message || err}`);
        }
        const upiId = 'freshioz@icici';
        const payeeName = 'Freshioz Produce';
        const transactionNote = `Freshioz Order ${order.id.slice(-6).toUpperCase()}`;
        const standardUpiString = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${amountInRupees}&cu=INR&tn=${encodeURIComponent(transactionNote)}`;
        if (!imageUrl) {
            imageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=280x280&margin=10&data=${encodeURIComponent(standardUpiString)}`;
        }
        return {
            orderId: order.id,
            amount: amountInRupees,
            currency: 'INR',
            qrId,
            imageUrl,
            paymentUrl: paymentUrl || standardUpiString,
            upiString: standardUpiString,
            gatewaySource,
            societyName: order.society?.name || 'Society Drop Desk',
            flatNo: order.flatNo || '',
            paymentStatus: order.paymentStatus,
        };
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
        if (event === 'payment.captured' || event === 'order.paid' || event === 'qr_code.credited') {
            const payment = body?.payload?.payment?.entity;
            const qrEntity = body?.payload?.qr_code?.entity;
            const rzpOrderId = payment?.order_id;
            const rzpPaymentId = payment?.id;
            const targetOrderId = payment?.notes?.orderId || qrEntity?.notes?.orderId;
            if (targetOrderId) {
                const existingOrder = await this.prisma.order.findUnique({
                    where: { id: targetOrderId },
                });
                if (existingOrder && existingOrder.paymentStatus !== 'PAID') {
                    await this.prisma.order.update({
                        where: { id: existingOrder.id },
                        data: {
                            paymentStatus: 'PAID',
                            razorpayPaymentId: rzpPaymentId || existingOrder.razorpayPaymentId,
                            codCollectedAmount: payment?.amount ? payment.amount / 100 : existingOrder.totalAmount,
                            codReceivedMode: 'UPI_QR',
                            codCollectedAt: new Date(),
                        },
                    });
                    this.logger.log(`Webhook auto-reconciled COD order #${existingOrder.id} to PAID via UPI QR`);
                }
            }
            else if (rzpOrderId) {
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
    async getOrCreateFreshCoinsSettings() {
        let setting = await this.prisma.freshCoinsSetting.findUnique({
            where: { id: 'COINS_CONFIG' },
        });
        if (!setting) {
            setting = await this.prisma.freshCoinsSetting.create({
                data: {
                    id: 'COINS_CONFIG',
                    isEnabled: true,
                    earningRatePercent: 5.0,
                    coinRupeeValue: 1.0,
                    maxRedemptionPercent: 25.0,
                    minOrderValue: 100.0,
                },
            });
        }
        return setting;
    }
    async getFreshCoinsSettings() {
        return this.getOrCreateFreshCoinsSettings();
    }
    async updateFreshCoinsSettings(dto, user) {
        await this.getOrCreateFreshCoinsSettings();
        return this.prisma.freshCoinsSetting.update({
            where: { id: 'COINS_CONFIG' },
            data: {
                isEnabled: dto.isEnabled !== undefined ? Boolean(dto.isEnabled) : true,
                earningRatePercent: dto.earningRatePercent !== undefined ? Number(dto.earningRatePercent) : 5.0,
                coinRupeeValue: dto.coinRupeeValue !== undefined ? Number(dto.coinRupeeValue) : 1.0,
                maxRedemptionPercent: dto.maxRedemptionPercent !== undefined ? Number(dto.maxRedemptionPercent) : 25.0,
                minOrderValue: dto.minOrderValue !== undefined ? Number(dto.minOrderValue) : 100.0,
                updatedBy: user?.name || user?.email || 'Super Admin',
            },
        });
    }
    async getFreshCoinsPublicConfig() {
        const setting = await this.getOrCreateFreshCoinsSettings();
        return {
            isEnabled: setting.isEnabled,
            earningRatePercent: setting.earningRatePercent,
            coinRupeeValue: setting.coinRupeeValue,
            maxRedemptionPercent: setting.maxRedemptionPercent,
            minOrderValue: setting.minOrderValue,
        };
    }
    async getCustomerFreshCoinsWallet(user) {
        const phone = user?.phone || user?.id;
        const userRecord = await this.prisma.user.findFirst({
            where: { OR: [{ phone }, { id: phone }] },
        });
        const balance = userRecord?.freshCoinsBalance || 0;
        const lifetimeEarned = userRecord?.lifetimeCoinsEarned || 0;
        const history = await this.prisma.freshCoinsLedger.findMany({
            where: { userId: phone },
            orderBy: { createdAt: 'desc' },
            take: 50,
        });
        const setting = await this.getOrCreateFreshCoinsSettings();
        return {
            balance,
            rupeeValue: Number((balance * setting.coinRupeeValue).toFixed(2)),
            lifetimeEarned,
            setting: {
                isEnabled: setting.isEnabled,
                coinRupeeValue: setting.coinRupeeValue,
                maxRedemptionPercent: setting.maxRedemptionPercent,
                minOrderValue: setting.minOrderValue,
                earningRatePercent: setting.earningRatePercent,
            },
            history,
        };
    }
    async getOrCreateDeliverySettings() {
        let setting = await this.prisma.deliverySetting.findUnique({
            where: { id: 'DELIVERY_CONFIG' },
        });
        if (!setting) {
            setting = await this.prisma.deliverySetting.create({
                data: {
                    id: 'DELIVERY_CONFIG',
                    baseFee: 25.0,
                    freeDeliveryThreshold: 299.0,
                    enableFreeDelivery: true,
                },
            });
        }
        return setting;
    }
    async getDeliverySettings() {
        return this.getOrCreateDeliverySettings();
    }
    async updateDeliverySettings(dto, user) {
        await this.getOrCreateDeliverySettings();
        return this.prisma.deliverySetting.update({
            where: { id: 'DELIVERY_CONFIG' },
            data: {
                baseFee: dto.baseFee !== undefined ? Math.max(0, Number(dto.baseFee)) : 25.0,
                freeDeliveryThreshold: dto.freeDeliveryThreshold !== undefined ? Math.max(0, Number(dto.freeDeliveryThreshold)) : 299.0,
                enableFreeDelivery: dto.enableFreeDelivery !== undefined ? Boolean(dto.enableFreeDelivery) : true,
                updatedBy: user?.name || user?.email || 'Super Admin',
            },
        });
    }
    async createDriverPayout(data, user) {
        const payout = await this.prisma.driverPayout.create({
            data: {
                driverId: data.driverId,
                driverName: data.driverName,
                driverPhone: data.driverPhone || '',
                warehouseId: data.warehouseId || 'ALL',
                warehouseName: data.warehouseName || 'Central Hub',
                amount: Number(data.amount) || 0,
                paymentMode: data.paymentMode || 'CASH',
                completedStopsCount: Number(data.completedStopsCount) || (data.coveredOrderIds?.length || 0),
                coveredOrderIds: Array.isArray(data.coveredOrderIds) ? data.coveredOrderIds : [],
                paidBy: user?.name || user?.email || 'Hub Manager',
                paidById: user?.id || '',
                notes: data.notes || '',
            }
        });
        return payout;
    }
    async listDriverPayouts(query, user) {
        const isSuperAdmin = user?.roles?.includes('SUPER_ADMIN') || user?.role === 'SUPER_ADMIN';
        const isDeliveryExecutive = user?.roles?.includes('DELIVERY_EXECUTIVE') || user?.role === 'DELIVERY_EXECUTIVE';
        const where = {};
        if (isDeliveryExecutive && !isSuperAdmin) {
            const riderPhoneClean = (user?.phone || '').replace(/\D/g, '').slice(-10);
            const riderOr = [];
            if (user?.id)
                riderOr.push({ driverId: user.id });
            if (user?.uuid)
                riderOr.push({ driverId: user.uuid });
            if (riderPhoneClean)
                riderOr.push({ driverPhone: { contains: riderPhoneClean } });
            if (user?.name) {
                riderOr.push({ driverName: { equals: user.name.trim(), mode: 'insensitive' } });
                riderOr.push({ driverName: { contains: user.name.trim(), mode: 'insensitive' } });
            }
            if (user?.email) {
                const uPrefix = user.email.split('@')[0].trim();
                if (uPrefix && uPrefix.length >= 3) {
                    riderOr.push({ driverName: { contains: uPrefix, mode: 'insensitive' } });
                    riderOr.push({ driverId: { contains: uPrefix, mode: 'insensitive' } });
                }
            }
            if (query?.driverId)
                riderOr.push({ driverId: query.driverId });
            if (query?.driverPhone) {
                const qp = query.driverPhone.replace(/\D/g, '').slice(-10);
                if (qp)
                    riderOr.push({ driverPhone: { contains: qp } });
            }
            if (query?.driverName) {
                riderOr.push({ driverName: { contains: query.driverName.trim(), mode: 'insensitive' } });
            }
            if (riderOr.length > 0) {
                where.OR = riderOr;
            }
        }
        else {
            if (query?.driverId)
                where.driverId = query.driverId;
            if (query?.warehouseId && query.warehouseId !== 'ALL')
                where.warehouseId = query.warehouseId;
        }
        return this.prisma.driverPayout.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            take: 200,
        });
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = PaymentsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        orders_service_1.OrdersService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map