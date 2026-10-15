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
            let society = null;
            if (dto.societyId) {
                society = await tx.society.findFirst({
                    where: { OR: [{ id: dto.societyId }, { uuid: dto.societyId }] },
                });
            }
            let warehouse = null;
            const targetWarehouseId = dto.warehouseId || society?.warehouseId;
            if (targetWarehouseId) {
                warehouse = await tx.warehouse.findFirst({
                    where: { OR: [{ id: targetWarehouseId }, { uuid: targetWarehouseId }] },
                });
            }
            const warehouseId = warehouse ? warehouse.id : null;
            const societyId = society ? society.id : null;
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
                        flatNo: dto.flatNo || 'Flat 101',
                    },
                });
            }
            let calculatedSubtotal = 0;
            let calculatedBulkSavings = 0;
            const verifiedItems = [];
            for (const item of dto.items) {
                const product = await tx.product.findFirst({
                    where: { OR: [{ id: item.productId }, { uuid: item.productId }, { name: item.name }] },
                });
                if (!product) {
                    throw new common_1.BadRequestException(`Product '${item.name || item.productId}' is currently unavailable in the catalog.`);
                }
                const unitPrice = product ? product.retailPrice : (Number(item.price) || 0);
                const qty = Number(item.qty) || 1;
                const lineOriginalTotal = unitPrice * qty;
                let effectiveUnitPrice = unitPrice;
                let lineBulkSavings = 0;
                let isBulkApplied = false;
                if (product && product.bulkMinQty > 0 && product.bulkDiscountPercent > 0 && qty >= product.bulkMinQty) {
                    isBulkApplied = true;
                    const discountRatio = product.bulkDiscountPercent / 100;
                    effectiveUnitPrice = Number((unitPrice * (1 - discountRatio)).toFixed(2));
                    lineBulkSavings = Number(((unitPrice - effectiveUnitPrice) * qty).toFixed(2));
                }
                const lineFinalTotal = Number((effectiveUnitPrice * qty).toFixed(2));
                calculatedSubtotal += lineOriginalTotal;
                calculatedBulkSavings += lineBulkSavings;
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
                        if (inv.currentQty < qty) {
                            throw new common_1.BadRequestException(`Produce item "${product.name}" has insufficient stock in warehouse. Available: ${inv.currentQty} ${inv.unit}, requested: ${qty} ${inv.unit}`);
                        }
                        await tx.warehouseInventory.update({
                            where: {
                                warehouseId_productId: {
                                    warehouseId,
                                    productId: product.id,
                                },
                            },
                            data: {
                                currentQty: inv.currentQty - qty,
                                reservedQty: inv.reservedQty + qty,
                            },
                        });
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
            const gstAmount = Math.max(0, Number(dto.gstAmount) || 0);
            const calculatedTotalAmount = Number((itemsNetTotal + deliveryFee + gstAmount).toFixed(2));
            let societyCommission = 0;
            if (society) {
                if (society.commissionType === 'PERCENTAGE') {
                    societyCommission = Number(((calculatedTotalAmount * society.commissionValue) / 100).toFixed(2));
                }
                else {
                    societyCommission = Number(society.commissionValue.toFixed(2));
                }
            }
            const orderId = `ORD-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;
            const created = await tx.order.create({
                data: {
                    id: orderId,
                    userId: user.phone,
                    userName: dto.userName.trim(),
                    userPhone: dto.userPhone.trim(),
                    societyId: society?.id || null,
                    societyName: society?.name || dto.societyName || 'Direct Resident Delivery',
                    flatNo: dto.flatNo,
                    warehouseId,
                    warehouseCode: dto.warehouseCode || null,
                    orderType: calculatedBulkSavings > 0 ? 'BULK' : 'RETAIL',
                    subtotal: calculatedSubtotal,
                    bulkSavings: calculatedBulkSavings,
                    deliveryFee,
                    gstAmount,
                    totalAmount: calculatedTotalAmount,
                    deliveryDate: dto.deliveryDate,
                    deliverySlot: dto.deliverySlot,
                    status: 'CONFIRMED',
                    paymentMethod: dto.paymentMethod || 'UPI',
                    paymentStatus: dto.paymentStatus || 'PAID',
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
            if (dto.status === 'DELIVERED' && existing.status !== 'DELIVERED') {
                updateData.deliveredAt = new Date();
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
            const updated = await tx.order.update({
                where: { id: existing.id },
                data: updateData,
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
                include: { society: true },
            });
            if (!existing) {
                throw new common_1.NotFoundException(`Order #${idOrUuid} not found`);
            }
            const isCustomer = user?.type === 'CUSTOMER';
            if (isCustomer && existing.userPhone !== user.phone && existing.userId !== user.id) {
                throw new common_1.ForbiddenException('Access denied. You can only cancel your own orders.');
            }
            if (existing.status === 'CANCELLED') {
                throw new common_1.BadRequestException('Order is already cancelled.');
            }
            if (existing.status === 'DELIVERED') {
                throw new common_1.BadRequestException('Delivered orders cannot be cancelled.');
            }
            if (isCustomer && existing.status === 'DISPATCHED') {
                throw new common_1.BadRequestException('Order is out for delivery with our rider and cannot be cancelled online.');
            }
            if (existing.status === 'DELIVERED' && existing.societyId && existing.societyCommissionEarned > 0) {
                await tx.society.update({
                    where: { id: existing.societyId },
                    data: {
                        balanceEarned: { decrement: existing.societyCommissionEarned },
                        totalOrdersDelivered: { decrement: 1 },
                    },
                });
            }
            const updated = await tx.order.update({
                where: { id: existing.id },
                data: {
                    status: 'CANCELLED',
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