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
exports.InventoryService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const date_utils_1 = require("../common/date-utils");
let InventoryService = class InventoryService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(warehouseId) {
        const where = {};
        if (warehouseId && warehouseId !== 'ALL') {
            where.warehouseId = warehouseId;
        }
        const items = await this.prisma.warehouseInventory.findMany({
            where,
            include: {
                warehouse: true,
                product: true,
            },
            orderBy: { updatedAt: 'desc' },
        });
        return items.map((item) => ({
            id: item.id,
            warehouseId: item.warehouseId,
            warehouseName: item.warehouse?.name,
            productId: item.productId,
            productName: item.product?.name,
            currentQty: item.currentQty,
            quantity: item.currentQty,
            stockQty: item.currentQty,
            reservedQty: item.reservedQty,
            availableQty: Math.max(0, item.currentQty - item.reservedQty),
            unit: item.unit,
            updatedAtFormatted: (0, date_utils_1.toISTFullString)(item.updatedAt),
        }));
    }
    async adjustStock(dto) {
        const existing = await this.prisma.warehouseInventory.findUnique({
            where: {
                warehouseId_productId: {
                    warehouseId: dto.warehouseId,
                    productId: dto.productId,
                },
            },
        });
        let newQty = dto.qty;
        if (existing) {
            if (dto.action === 'ADD') {
                newQty = existing.currentQty + dto.qty;
            }
            else if (dto.action === 'REDUCE') {
                newQty = Math.max(0, existing.currentQty - dto.qty);
            }
        }
        const updated = await this.prisma.warehouseInventory.upsert({
            where: {
                warehouseId_productId: {
                    warehouseId: dto.warehouseId,
                    productId: dto.productId,
                },
            },
            update: {
                currentQty: newQty,
            },
            create: {
                warehouseId: dto.warehouseId,
                productId: dto.productId,
                currentQty: newQty,
                reservedQty: 0,
                unit: 'kg',
            },
            include: {
                warehouse: true,
                product: true,
            },
        });
        return {
            id: updated.id,
            warehouseId: updated.warehouseId,
            warehouseName: updated.warehouse?.name,
            productId: updated.productId,
            productName: updated.product?.name,
            currentQty: updated.currentQty,
            reservedQty: updated.reservedQty,
            availableQty: Math.max(0, updated.currentQty - updated.reservedQty),
            unit: updated.unit,
            updatedAtFormatted: (0, date_utils_1.toISTFullString)(updated.updatedAt),
        };
    }
};
exports.InventoryService = InventoryService;
exports.InventoryService = InventoryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], InventoryService);
//# sourceMappingURL=inventory.service.js.map