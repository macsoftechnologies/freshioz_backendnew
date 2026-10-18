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
exports.CatalogService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const delivery_constants_1 = require("./delivery.constants");
let CatalogService = class CatalogService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getPublicCatalog() {
        const [categories, units, products, societies, warehouses] = await Promise.all([
            this.prisma.category.findMany({
                where: { status: 'ACTIVE' },
                orderBy: { sortOrder: 'asc' },
                select: { id: true, name: true, slug: true, icon: true, description: true, sortOrder: true },
            }),
            this.prisma.unit.findMany({
                where: { status: 'ACTIVE' },
                orderBy: { createdAt: 'asc' },
                select: { id: true, name: true, label: true, isBulk: true, description: true },
            }),
            this.prisma.product.findMany({
                where: { status: 'ACTIVE' },
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true, name: true, kannadaName: true, categoryId: true,
                    category: { select: { name: true } },
                    retailUnit: true, retailPrice: true, retailMarketPrice: true,
                    bulkMinQty: true, bulkDiscountPercent: true, gstPercent: true,
                    origin: true, shelfLife: true, desc: true, image: true, badge: true,
                    tags: true, inStock: true, status: true,
                },
            }),
            this.prisma.society.findMany({
                where: { status: 'APPROVED' },
                orderBy: { name: 'asc' },
                select: {
                    id: true, name: true, type: true, address: true, imageUrl: true,
                    lat: true, lng: true, warehouseId: true, deliveryMode: true, status: true,
                },
            }),
            this.prisma.warehouse.findMany({
                where: { status: 'ACTIVE' },
                select: {
                    id: true, code: true, name: true, location: true, lat: true, lng: true,
                    openTime: true, cutoffTime: true, status: true,
                },
            }),
        ]);
        return {
            categories,
            units,
            products: products.map(({ category, ...p }) => ({
                ...p,
                category: category?.name ?? 'Vegetables',
            })),
            societies,
            warehouses,
            deliveryConfig: delivery_constants_1.DELIVERY_CONFIG,
            syncedAt: new Date().toISOString(),
        };
    }
};
exports.CatalogService = CatalogService;
exports.CatalogService = CatalogService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CatalogService);
//# sourceMappingURL=catalog.service.js.map