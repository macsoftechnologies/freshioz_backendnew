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
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const date_utils_1 = require("../common/date-utils");
let OrdersService = class OrdersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(query) {
        const where = {};
        if (query?.status)
            where.status = query.status;
        if (query?.societyId)
            where.societyId = query.societyId;
        if (query?.warehouseId && query.warehouseId !== 'ALL')
            where.warehouseId = query.warehouseId;
        if (query?.phone) {
            where.OR = [
                { userPhone: query.phone },
                { userId: query.phone },
            ];
        }
        const orders = await this.prisma.order.findMany({
            where,
            include: {
                items: true,
                society: true,
                warehouse: true,
            },
            orderBy: { orderPlacedAt: 'desc' },
        });
        return orders.map((o) => ({
            ...o,
            orderPlacedAtFormatted: (0, date_utils_1.toISTFullString)(o.orderPlacedAt),
            createdAtFormatted: (0, date_utils_1.toISTFullString)(o.createdAt),
        }));
    }
    async findOne(idOrUuid) {
        const order = await this.prisma.order.findFirst({
            where: {
                OR: [{ id: idOrUuid }, { uuid: idOrUuid }],
            },
            include: {
                items: true,
                society: true,
                warehouse: true,
            },
        });
        if (!order) {
            throw new common_1.NotFoundException(`Order #${idOrUuid} not found`);
        }
        return {
            ...order,
            orderPlacedAtFormatted: (0, date_utils_1.toISTFullString)(order.orderPlacedAt),
            createdAtFormatted: (0, date_utils_1.toISTFullString)(order.createdAt),
        };
    }
    async create(dto) {
        if (!dto.items || dto.items.length === 0) {
            throw new common_1.BadRequestException('Order must contain at least one line item');
        }
        return this.prisma.$transaction(async (tx) => {
            if (!dto.societyId) {
                throw new common_1.BadRequestException('Society ID is required. Please select a registered community.');
            }
            const society = await tx.society.findFirst({
                where: { OR: [{ id: dto.societyId }, { uuid: dto.societyId }] },
            });
            if (!society) {
                throw new common_1.BadRequestException(`Selected society '${dto.societyId}' does not exist.`);
            }
            if (society.status !== 'APPROVED') {
                throw new common_1.BadRequestException(`Society '${society.name}' is currently '${society.status}'. Orders can only be placed for APPROVED communities.`);
            }
            if (!society.warehouseId) {
                throw new common_1.BadRequestException(`Society '${society.name}' has no assigned regional warehouse hub.`);
            }
            const warehouse = await tx.warehouse.findFirst({
                where: { OR: [{ id: society.warehouseId }, { uuid: society.warehouseId }] },
            });
            if (!warehouse || warehouse.status !== 'ACTIVE') {
                throw new common_1.BadRequestException(`Serving warehouse for '${society.name}' is inactive or not found.`);
            }
            const warehouseId = warehouse.id;
            const societyId = society.id;
            const flatNo = (dto.flatNo || '').trim();
            if (!flatNo) {
                throw new common_1.BadRequestException('Flat / Door number is required for delivery.');
            }
            let user = await tx.user.findUnique({
                where: { phone: dto.userPhone.trim() },
            });
            if (!user) {
                user = await tx.user.create({
                    data: {
                        id: `USR_${dto.userPhone.trim()}`,
                        phone: dto.userPhone.trim(),
                        name: dto.userName.trim(),
                        societyId,
                        flatNo,
                    },
                });
            }
            let calculatedSubtotal = 0;
            let calculatedBulkSavings = 0;
            let calculatedGstTotal = 0;
            const verifiedItems = [];
            for (const item of dto.items) {
                const product = await tx.product.findFirst({
                    where: { OR: [{ id: item.productId }, { uuid: item.productId }, { name: item.name }] },
                });
                if (!product) {
                    throw new common_1.BadRequestException(`Product '${item.name || item.productId}' is currently unavailable in the catalog.`);
                }
                let unitPrice = product ? product.retailPrice : (Number(item.price) || 0);
                let bulkMinQty = product ? product.bulkMinQty : 0;
                let bulkDiscountPercent = product ? product.bulkDiscountPercent : 0;
                if (product && dto.deliveryDate) {
                    let d;
                    if (dto.deliveryDate.includes('/')) {
                        const [day, month, year] = dto.deliveryDate.split('/').map(Number);
                        d = new Date(year, month - 1, day);
                    }
                    else {
                        d = new Date(dto.deliveryDate);
                    }
                    if (!isNaN(d.getTime())) {
                        const start = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0);
                        const end = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
                        const hist = await tx.dailyPriceHistory.findFirst({
                            where: {
                                productId: product.id,
                                publishedAt: { gte: start, lte: end },
                            },
                            orderBy: { publishedAt: 'desc' },
                        });
                        if (hist) {
                            unitPrice = hist.retailPrice;
                            bulkMinQty = hist.bulkMinQty;
                            bulkDiscountPercent = hist.bulkDiscountPercent;
                        }
                    }
                }
                const rawQty = Number(item.qty);
                if (isNaN(rawQty) || rawQty <= 0) {
                    throw new common_1.BadRequestException(`Invalid quantity for produce '${item.name || item.productId}'. Quantity must be greater than zero.`);
                }
                if (rawQty > 1000) {
                    throw new common_1.BadRequestException(`Quantity '${rawQty}' exceeds maximum allowed limit (1000) for '${item.name || item.productId}'.`);
                }
                const qty = Number(rawQty.toFixed(2));
                const lineOriginalTotal = unitPrice * qty;
                let effectiveUnitPrice = unitPrice;
                let lineBulkSavings = 0;
                let isBulkApplied = false;
                if (product && bulkMinQty > 0 && bulkDiscountPercent > 0 && qty >= bulkMinQty) {
                    isBulkApplied = true;
                    const discountRatio = bulkDiscountPercent / 100;
                    effectiveUnitPrice = Number((unitPrice * (1 - discountRatio)).toFixed(2));
                    lineBulkSavings = Number(((unitPrice - effectiveUnitPrice) * qty).toFixed(2));
                }
                const lineFinalTotal = Number((effectiveUnitPrice * qty).toFixed(2));
                calculatedSubtotal += lineOriginalTotal;
                calculatedBulkSavings += lineBulkSavings;
                const itemGstPercent = product ? (product.gstPercent || 0) : 0;
                const itemGst = itemGstPercent > 0 ? Number(((lineFinalTotal * itemGstPercent) / 100).toFixed(2)) : 0;
                calculatedGstTotal += itemGst;
                verifiedItems.push({
                    productId: product ? product.id : item.productId,
                    name: product ? product.name : item.name,
                    unit: product ? product.retailUnit : (item.unit || '1 kg'),
                    qty,
                    price: unitPrice,
                    effectivePrice: effectiveUnitPrice,
                    totalPrice: lineFinalTotal,
                    isBulkApplied,
                    bulkDiscountPercent: product ? product.bulkDiscountPercent : (item.bulkDiscountPercent || 0),
                    bulkSavings: lineBulkSavings,
                });
                if (warehouseId && product) {
                    const inv = await tx.warehouseInventory.findUnique({
                        where: {
                            warehouseId_productId: {
                                warehouseId,
                                productId: product.id,
                            },
                        },
                    });
                    if (inv) {
                        const availableToReserve = Math.min(Math.max(0, inv.currentQty), qty);
                        if (availableToReserve > 0) {
                            await tx.warehouseInventory.update({
                                where: {
                                    warehouseId_productId: {
                                        warehouseId,
                                        productId: product.id,
                                    },
                                },
                                data: {
                                    currentQty: Math.max(0, inv.currentQty - availableToReserve),
                                    reservedQty: (inv.reservedQty || 0) + availableToReserve,
                                },
                            });
                        }
                    }
                }
            }
            const itemsNetTotal = Math.max(0, calculatedSubtotal - calculatedBulkSavings);
            let deliveryFee = 0;
            if (itemsNetTotal > 0 && itemsNetTotal < 299) {
                deliveryFee = Math.max(0, Number(dto.deliveryFee) || 25);
            }
            else {
                deliveryFee = 0;
            }
            const gstAmount = Number(calculatedGstTotal.toFixed(2));
            let appliedDiscountAmount = 0;
            let matchedDiscount = null;
            if (dto.discountCode) {
                matchedDiscount = await tx.customerDiscount.findUnique({
                    where: { code: dto.discountCode.trim().toUpperCase() },
                });
                if (!matchedDiscount) {
                    throw new common_1.BadRequestException('Invalid reward discount code.');
                }
                const customerPhone = user?.phone || dto.userPhone;
                const customerId = user?.id;
                if (matchedDiscount.userId !== customerPhone && matchedDiscount.userId !== customerId) {
                    throw new common_1.ForbiddenException('This reward discount belongs to another customer account.');
                }
                if (matchedDiscount.status === 'REVOKED') {
                    throw new common_1.BadRequestException('This discount code has been revoked.');
                }
                if (matchedDiscount.status === 'REDEEMED' || matchedDiscount.usedCount >= matchedDiscount.maxUses) {
                    throw new common_1.BadRequestException('This discount code has already been redeemed.');
                }
                if (new Date(matchedDiscount.expiresAt).getTime() <= Date.now()) {
                    throw new common_1.BadRequestException('This reward discount has expired.');
                }
                if (matchedDiscount.minOrderAmount > 0 && itemsNetTotal < matchedDiscount.minOrderAmount) {
                    throw new common_1.BadRequestException(`Minimum order amount of ₹${matchedDiscount.minOrderAmount} required for this reward.`);
                }
                if (matchedDiscount.discountType === 'PERCENTAGE') {
                    appliedDiscountAmount = Number(((itemsNetTotal * matchedDiscount.discountValue) / 100).toFixed(2));
                }
                else {
                    appliedDiscountAmount = Math.min(itemsNetTotal, matchedDiscount.discountValue);
                }
            }
            const calculatedTotalAmount = Number(Math.max(0, itemsNetTotal + deliveryFee + gstAmount - appliedDiscountAmount).toFixed(2));
            let societyCommission = 0;
            if (society) {
                if (society.commissionType === 'PERCENTAGE') {
                    societyCommission = Number(((calculatedTotalAmount * society.commissionValue) / 100).toFixed(2));
                }
                else {
                    societyCommission = Number(society.commissionValue.toFixed(2));
                }
            }
            const cutoffTimeStr = warehouse?.cutoffTime || '21:00';
            const [cutoffH, cutoffM] = cutoffTimeStr.split(':').map(Number);
            const nowUtc = new Date();
            const istTime = new Date(nowUtc.getTime() + (5.5 * 60 * 60 * 1000));
            const currentIstHours = istTime.getUTCHours();
            const currentIstMinutes = istTime.getUTCMinutes();
            const isPastCutoff = (currentIstHours > cutoffH) || (currentIstHours === cutoffH && currentIstMinutes >= cutoffM);
            const deliveryDateObj = new Date(istTime);
            if (isPastCutoff) {
                deliveryDateObj.setUTCDate(deliveryDateObj.getUTCDate() + 2);
            }
            else {
                deliveryDateObj.setUTCDate(deliveryDateObj.getUTCDate() + 1);
            }
            const dDay = String(deliveryDateObj.getUTCDate()).padStart(2, '0');
            const dMonth = String(deliveryDateObj.getUTCMonth() + 1).padStart(2, '0');
            const dYear = deliveryDateObj.getUTCFullYear();
            const serverCalculatedDeliveryDate = `${dDay}/${dMonth}/${dYear}`;
            const orderId = `ORD-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;
            const created = await tx.order.create({
                data: {
                    id: orderId,
                    userId: user.phone,
                    userName: dto.userName.trim(),
                    userPhone: dto.userPhone.trim(),
                    societyId: society?.id || null,
                    societyName: society?.name || dto.societyName || 'Direct Resident Delivery',
                    flatNo,
                    warehouseId,
                    warehouseCode: warehouse?.code || dto.warehouseCode || null,
                    orderType: calculatedBulkSavings > 0 ? 'BULK' : 'RETAIL',
                    subtotal: calculatedSubtotal,
                    bulkSavings: calculatedBulkSavings,
                    deliveryFee,
                    gstAmount,
                    totalAmount: calculatedTotalAmount,
                    deliveryDate: serverCalculatedDeliveryDate,
                    deliverySlot: dto.deliverySlot || 'Morning Fresh Slot (06:30 AM - 08:30 AM)',
                    status: 'CONFIRMED',
                    paymentMethod: 'PAY_ON_DELIVERY',
                    paymentStatus: 'PENDING_COD',
                    societyCommissionEarned: societyCommission,
                    items: {
                        create: verifiedItems,
                    },
                },
                include: {
                    items: true,
                    society: true,
                    warehouse: true,
                },
            });
            if (matchedDiscount) {
                const updateCount = await tx.customerDiscount.updateMany({
                    where: {
                        id: matchedDiscount.id,
                        status: 'ACTIVE',
                        usedCount: { lt: matchedDiscount.maxUses },
                    },
                    data: {
                        usedCount: { increment: 1 },
                        redeemedAt: new Date(),
                        orderId: created.id,
                    },
                });
                if (updateCount.count === 0) {
                    throw new common_1.ConflictException('This discount code was concurrently redeemed or is no longer available.');
                }
                const refreshed = await tx.customerDiscount.findUnique({ where: { id: matchedDiscount.id } });
                if (refreshed && refreshed.usedCount >= refreshed.maxUses) {
                    await tx.customerDiscount.update({
                        where: { id: matchedDiscount.id },
                        data: { status: 'REDEEMED' },
                    });
                }
            }
            return {
                ...created,
                orderPlacedAtFormatted: (0, date_utils_1.toISTFullString)(created.orderPlacedAt),
                createdAtFormatted: (0, date_utils_1.toISTFullString)(created.createdAt),
            };
        });
    }
    async updateStatus(idOrUuid, dto) {
        return this.prisma.$transaction(async (tx) => {
            const existing = await tx.order.findFirst({
                where: {
                    OR: [{ id: idOrUuid }, { uuid: idOrUuid }],
                },
                include: { society: true },
            });
            if (!existing) {
                throw new common_1.NotFoundException(`Order #${idOrUuid} not found`);
            }
            if (existing.status === 'CANCELLED') {
                throw new common_1.BadRequestException('Cannot update status of an order that has already been cancelled.');
            }
            const updateData = {};
            if (dto.status)
                updateData.status = dto.status;
            if (dto.paymentStatus)
                updateData.paymentStatus = dto.paymentStatus;
            if (dto.codCollectedAmount !== undefined)
                updateData.codCollectedAmount = dto.codCollectedAmount;
            if (dto.codCollectedBy) {
                updateData.codCollectedBy = dto.codCollectedBy;
                updateData.codCollectedAt = new Date();
            }
            if (dto.codSettledToHub !== undefined) {
                updateData.codSettledToHub = dto.codSettledToHub;
                if (dto.codSettledToHub) {
                    updateData.codSettledAt = new Date();
                    updateData.codSettledBy = dto.codSettledBy || 'Hub Cashier Desk';
                }
            }
            if (dto.codReceivedMode) {
                updateData.codReceivedMode = dto.codReceivedMode;
            }
            if (dto.status === 'DELIVERED') {
                updateData.deliveredAt = new Date();
                const updateResult = await tx.order.updateMany({
                    where: {
                        id: existing.id,
                        status: { notIn: ['DELIVERED', 'CANCELLED'] },
                    },
                    data: updateData,
                });
                if (updateResult.count === 0) {
                    throw new common_1.ConflictException('Cannot mark order as delivered because it was concurrently cancelled or already delivered.');
                }
                if (existing.societyId && existing.societyCommissionEarned > 0) {
                    await tx.society.update({
                        where: { id: existing.societyId },
                        data: {
                            balanceEarned: { increment: existing.societyCommissionEarned },
                            totalOrdersDelivered: { increment: 1 },
                        },
                    });
                }
            }
            else {
                await tx.order.update({
                    where: { id: existing.id },
                    data: updateData,
                });
            }
            const updated = await tx.order.findUnique({
                where: { id: existing.id },
                include: { items: true, society: true },
            });
            return {
                ...updated,
                orderPlacedAtFormatted: (0, date_utils_1.toISTFullString)(updated.orderPlacedAt),
                createdAtFormatted: (0, date_utils_1.toISTFullString)(updated.createdAt),
            };
        });
    }
    async cancelOrder(idOrUuid, user, reason) {
        return this.prisma.$transaction(async (tx) => {
            const existing = await tx.order.findFirst({
                where: {
                    OR: [{ id: idOrUuid }, { uuid: idOrUuid }],
                },
                include: { items: true, society: true },
            });
            if (!existing) {
                throw new common_1.NotFoundException(`Order #${idOrUuid} not found`);
            }
            const isCustomer = user?.type === 'CUSTOMER';
            if (isCustomer && existing.userPhone !== user.phone && existing.userId !== user.id) {
                throw new common_1.ForbiddenException('Access denied. You can only cancel your own orders.');
            }
            if (isCustomer && existing.status !== 'CONFIRMED') {
                throw new common_1.BadRequestException(`Order cannot be cancelled by resident because it is already in '${existing.status}' status.`);
            }
            if (existing.status === 'CANCELLED') {
                throw new common_1.BadRequestException('Order is already cancelled.');
            }
            if (existing.status === 'DELIVERED') {
                throw new common_1.BadRequestException('Delivered orders cannot be cancelled.');
            }
            const cancelResult = await tx.order.updateMany({
                where: {
                    id: existing.id,
                    status: { notIn: ['DELIVERED', 'CANCELLED'] },
                },
                data: {
                    status: 'CANCELLED',
                    cancelledReason: reason || (isCustomer ? 'Cancelled by resident' : 'Cancelled by hub operations'),
                    cancelledAt: new Date(),
                },
            });
            if (cancelResult.count === 0) {
                throw new common_1.ConflictException('Order cannot be cancelled because it was concurrently delivered or already cancelled.');
            }
            const appliedDiscount = await tx.customerDiscount.findFirst({
                where: { orderId: existing.id },
            });
            if (appliedDiscount) {
                await tx.customerDiscount.update({
                    where: { id: appliedDiscount.id },
                    data: {
                        usedCount: Math.max(0, appliedDiscount.usedCount - 1),
                        status: 'ACTIVE',
                        redeemedAt: null,
                        orderId: null,
                    },
                });
            }
            if (existing.warehouseId && Array.isArray(existing.items)) {
                for (const item of existing.items) {
                    if (!item.productId)
                        continue;
                    const inv = await tx.warehouseInventory.findUnique({
                        where: {
                            warehouseId_productId: {
                                warehouseId: existing.warehouseId,
                                productId: item.productId,
                            },
                        },
                    });
                    if (inv) {
                        const toRestore = Math.min(Math.max(0, inv.reservedQty || 0), item.qty);
                        if (toRestore > 0) {
                            await tx.warehouseInventory.update({
                                where: {
                                    warehouseId_productId: {
                                        warehouseId: existing.warehouseId,
                                        productId: item.productId,
                                    },
                                },
                                data: {
                                    currentQty: inv.currentQty + toRestore,
                                    reservedQty: Math.max(0, (inv.reservedQty || 0) - toRestore),
                                },
                            });
                        }
                    }
                }
            }
            const updated = await tx.order.findUnique({
                where: { id: existing.id },
                include: { items: true, society: true },
            });
            return {
                ...updated,
                orderPlacedAtFormatted: (0, date_utils_1.toISTFullString)(updated.orderPlacedAt),
                createdAtFormatted: (0, date_utils_1.toISTFullString)(updated.createdAt),
            };
        });
    }
    async settleCod(idOrUuid, manager) {
        return this.prisma.$transaction(async (tx) => {
            const existing = await tx.order.findFirst({
                where: {
                    OR: [{ id: idOrUuid }, { uuid: idOrUuid }],
                },
                include: { items: true, society: true },
            });
            if (!existing) {
                throw new common_1.NotFoundException(`Order #${idOrUuid} not found`);
            }
            if (existing.status !== 'DELIVERED') {
                throw new common_1.BadRequestException(`Only DELIVERED orders can be settled. Current order status: '${existing.status}'.`);
            }
            if (existing.codSettledToHub) {
                throw new common_1.BadRequestException('This order has already been settled to the hub cashier.');
            }
            const updated = await tx.order.update({
                where: { id: existing.id },
                data: {
                    codSettledToHub: true,
                    codSettledAt: new Date(),
                    codSettledBy: manager?.name || manager?.email || 'Hub Cashier Manager',
                    paymentStatus: 'PAID',
                },
                include: { items: true, society: true },
            });
            return {
                ...updated,
                orderPlacedAtFormatted: (0, date_utils_1.toISTFullString)(updated.orderPlacedAt),
                createdAtFormatted: (0, date_utils_1.toISTFullString)(updated.createdAt),
            };
        });
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map