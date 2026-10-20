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
exports.ProcurementService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const date_utils_1 = require("../common/date-utils");
let ProcurementService = class ProcurementService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        const bills = await this.prisma.procurementBill.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                vendor: true,
            },
        });
        return bills.map((b) => ({
            ...b,
            deliveryDate: (0, date_utils_1.toISTDateString)(b.procuredAt),
            procuredAtFormatted: (0, date_utils_1.toISTDateString)(b.procuredAt),
            procuredAtTime: (0, date_utils_1.toISTTimeString)(b.procuredAt),
            createdAtFormatted: (0, date_utils_1.toISTFullString)(b.createdAt),
        }));
    }
    async findOne(id) {
        const bill = await this.prisma.procurementBill.findUnique({
            where: { id },
            include: { vendor: true },
        });
        if (!bill) {
            throw new common_1.NotFoundException(`Procurement bill #${id} not found`);
        }
        return {
            ...bill,
            procuredAtFormatted: (0, date_utils_1.toISTDateString)(bill.procuredAt),
            procuredAtTime: (0, date_utils_1.toISTTimeString)(bill.procuredAt),
            createdAtFormatted: (0, date_utils_1.toISTFullString)(bill.createdAt),
        };
    }
    async create(dto) {
        return this.prisma.$transaction(async (tx) => {
            const billNumber = dto.billNumber || `APMC-${Date.now().toString().slice(-6)}`;
            const billId = `PB_${Date.now()}`;
            const computedWeight = dto.totalWeightKg !== undefined
                ? Number(dto.totalWeightKg)
                : (dto.items || []).reduce((sum, it) => sum + (Number(it.qty) || 0), 0);
            const computedProduceAmount = dto.produceAmount !== undefined
                ? Number(dto.produceAmount)
                : (dto.items || []).reduce((sum, it) => sum + ((Number(it.qty) || 0) * (Number(it.rate) || 0)), 0);
            const computedTransport = Number(dto.transportAmount) || 0;
            const computedTotalPaid = dto.totalAmountPaid !== undefined
                ? Number(dto.totalAmountPaid)
                : (dto.totalAmount !== undefined ? Number(dto.totalAmount) : (computedProduceAmount + computedTransport));
            const created = await tx.procurementBill.create({
                data: {
                    id: billId,
                    billNumber,
                    vendorId: dto.vendorId || null,
                    vendorName: dto.vendorName,
                    mandiLocation: dto.mandiLocation,
                    destinationWarehouseId: dto.destinationWarehouseId,
                    destinationName: dto.destinationName,
                    paymentMode: dto.paymentMode || 'IMPS_TRANSFER',
                    totalWeightKg: computedWeight,
                    produceAmount: computedProduceAmount,
                    transportAmount: computedTransport,
                    totalAmountPaid: computedTotalPaid,
                    receiptPhoto: dto.receiptPhoto || null,
                    procuredBy: dto.procuredBy || 'Admin Procurement Desk',
                    slot: dto.slot || 'Morning Fresh Slot',
                    items: dto.items,
                },
            });
            if (dto.destinationWarehouseId && Array.isArray(dto.items)) {
                for (const item of dto.items) {
                    const matchingProduct = await tx.product.findFirst({
                        where: {
                            name: { contains: item.name, mode: 'insensitive' },
                        },
                    });
                    if (matchingProduct) {
                        const rawQty = item.qty;
                        const parsedQty = typeof rawQty === 'string'
                            ? (parseFloat(rawQty.replace(/[^0-9.]/g, '')) || 0)
                            : (Number(rawQty) || 0);
                        await tx.warehouseInventory.upsert({
                            where: {
                                warehouseId_productId: {
                                    warehouseId: dto.destinationWarehouseId,
                                    productId: matchingProduct.id,
                                },
                            },
                            update: {
                                currentQty: { increment: parsedQty },
                            },
                            create: {
                                warehouseId: dto.destinationWarehouseId,
                                productId: matchingProduct.id,
                                currentQty: parsedQty,
                                reservedQty: 0,
                                unit: item.unit || 'kg',
                            },
                        });
                    }
                }
            }
            return {
                ...created,
                deliveryDate: (0, date_utils_1.toISTDateString)(created.procuredAt),
                procuredAtFormatted: (0, date_utils_1.toISTDateString)(created.procuredAt),
                createdAtFormatted: (0, date_utils_1.toISTFullString)(created.createdAt),
            };
        });
    }
    async delete(id) {
        const existing = await this.prisma.procurementBill.findUnique({ where: { id } });
        if (!existing) {
            throw new common_1.NotFoundException(`Procurement bill #${id} not found`);
        }
        await this.prisma.procurementBill.delete({ where: { id } });
        return { success: true, message: `Procurement bill #${id} deleted` };
    }
};
exports.ProcurementService = ProcurementService;
exports.ProcurementService = ProcurementService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProcurementService);
//# sourceMappingURL=procurement.service.js.map