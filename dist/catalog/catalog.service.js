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
function parseTargetDeliveryDateRange(dateStr) {
    if (dateStr) {
        let d;
        if (dateStr.includes('/')) {
            const [day, month, year] = dateStr.split('/').map(Number);
            d = new Date(year, month - 1, day);
        }
        else {
            d = new Date(dateStr);
        }
        if (isNaN(d.getTime()))
            d = new Date();
        const start = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0);
        const end = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
        return { start, end, dateObj: d };
    }
    const now = new Date();
    const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
    const istNow = new Date(utcMs + 5.5 * 3600000);
    const daysToAdd = istNow.getHours() >= 21 ? 2 : 1;
    const d = new Date(istNow);
    d.setDate(d.getDate() + daysToAdd);
    const start = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0);
    const end = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
    return { start, end, dateObj: d };
}
let CatalogService = class CatalogService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getPublicCatalog(targetDate) {
        const { start, end, dateObj } = parseTargetDeliveryDateRange(targetDate);
        const [categories, units, products, societies, warehouses, historyEntries] = await Promise.all([
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
            this.prisma.dailyPriceHistory.findMany({
                where: {
                    publishedAt: {
                        lte: end,
                    },
                },
                orderBy: { publishedAt: 'desc' },
            }),
        ]);
        const historyMap = new Map();
        for (const h of historyEntries) {
            if (!historyMap.has(h.productId)) {
                historyMap.set(h.productId, h);
            }
        }
        return {
            categories,
            units,
            products: products.map(({ category, ...p }) => {
                const h = historyMap.get(p.id);
                return {
                    ...p,
                    category: category?.name ?? 'Vegetables',
                    retailPrice: h ? h.retailPrice : p.retailPrice,
                    retailMarketPrice: h ? h.retailMarketPrice : p.retailMarketPrice,
                    bulkMinQty: h ? h.bulkMinQty : p.bulkMinQty,
                    bulkDiscountPercent: h ? h.bulkDiscountPercent : p.bulkDiscountPercent,
                    gstPercent: h ? h.gstPercent : p.gstPercent,
                    hasCustomDailyPrice: Boolean(h),
                };
            }),
            societies,
            warehouses,
            deliveryConfig: delivery_constants_1.DELIVERY_CONFIG,
            activeDeliveryDate: dateObj.toISOString().slice(0, 10),
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