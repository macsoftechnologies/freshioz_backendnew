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
exports.PricingService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const date_utils_1 = require("../common/date-utils");
function parseDateRange(dateStr) {
    if (!dateStr) {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
        const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
        return { start, end };
    }
    let d;
    if (dateStr.includes('/')) {
        const [day, month, year] = dateStr.split('/').map(Number);
        d = new Date(year, month - 1, day);
    }
    else {
        d = new Date(dateStr);
    }
    if (isNaN(d.getTime())) {
        d = new Date();
    }
    const start = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0);
    const end = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
    return { start, end };
}
let PricingService = class PricingService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getPricesByDate(date) {
        const formattedDate = date || (0, date_utils_1.toISTDateString)(new Date());
        const { start, end } = parseDateRange(date);
        const products = await this.prisma.product.findMany({
            orderBy: { id: 'asc' },
        });
        const historyEntries = await this.prisma.dailyPriceHistory.findMany({
            where: {
                publishedAt: {
                    lte: end,
                },
            },
            orderBy: { publishedAt: 'desc' },
        });
        const historyMap = new Map();
        for (const h of historyEntries) {
            if (!historyMap.has(h.productId)) {
                historyMap.set(h.productId, h);
            }
        }
        const unmappedProductIds = products.filter((p) => !historyMap.has(p.id)).map((p) => p.id);
        if (unmappedProductIds.length > 0) {
            const earliestEntries = await this.prisma.dailyPriceHistory.findMany({
                where: {
                    productId: { in: unmappedProductIds },
                },
                orderBy: { publishedAt: 'asc' },
            });
            for (const e of earliestEntries) {
                if (!historyMap.has(e.productId)) {
                    historyMap.set(e.productId, e);
                }
            }
        }
        const merged = products.map((p) => {
            const h = historyMap.get(p.id);
            return {
                id: p.id,
                productId: p.id,
                name: p.name,
                kannadaName: p.kannadaName,
                categoryId: p.categoryId,
                retailUnit: p.retailUnit,
                retailPrice: h ? h.retailPrice : p.retailPrice,
                retailMarketPrice: h ? h.retailMarketPrice : p.retailMarketPrice,
                bulkMinQty: h ? h.bulkMinQty : p.bulkMinQty,
                bulkDiscountPercent: h ? h.bulkDiscountPercent : p.bulkDiscountPercent,
                origin: p.origin,
                shelfLife: p.shelfLife,
                desc: p.desc,
                image: p.image,
                badge: p.badge,
                tags: p.tags,
                gstPercent: h ? h.gstPercent : p.gstPercent,
                status: p.status,
                inStock: p.inStock,
                hasCustomDailyPrice: Boolean(h),
                dailyPriceDate: formattedDate,
            };
        });
        return {
            date: formattedDate,
            dateIST: (0, date_utils_1.toISTDateString)(start),
            timestampIST: (0, date_utils_1.toISTFullString)(new Date()),
            entries: merged,
        };
    }
    async batchPublishPrices(body) {
        const rawPrices = body.prices || body.items || body.products;
        if (!Array.isArray(rawPrices) || rawPrices.length === 0) {
            throw new common_1.BadRequestException('prices or items array is required');
        }
        let publishDate = new Date();
        if (body.date) {
            let parsed;
            if (body.date.includes('/')) {
                const [day, month, year] = body.date.split('/').map(Number);
                parsed = new Date(year, month - 1, day, 12, 0, 0);
            }
            else {
                parsed = new Date(body.date);
                parsed.setHours(12, 0, 0, 0);
            }
            if (!isNaN(parsed.getTime())) {
                publishDate = parsed;
            }
        }
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);
        const isToday = publishDate >= todayStart && publishDate <= todayEnd;
        const results = await this.prisma.$transaction(async (tx) => {
            const records = [];
            for (const p of rawPrices) {
                const prodId = p.productId || p.id;
                if (!prodId)
                    continue;
                const rp = parseFloat(p.retailPrice) || 40.0;
                const rmp = parseFloat(p.retailMarketPrice) || Math.round(rp * 1.3);
                const bq = parseFloat(p.bulkMinQty) || 0;
                const bd = parseFloat(p.bulkDiscountPercent) || 0;
                const gst = parseFloat(p.gstPercent) || 0;
                if (publishDate >= todayStart) {
                    await tx.product.update({
                        where: { id: prodId },
                        data: {
                            retailPrice: rp,
                            retailMarketPrice: rmp,
                            bulkMinQty: bq,
                            bulkDiscountPercent: bd,
                            gstPercent: gst,
                        },
                    });
                }
                const hist = await tx.dailyPriceHistory.create({
                    data: {
                        productId: prodId,
                        retailPrice: rp,
                        retailMarketPrice: rmp,
                        bulkMinQty: bq,
                        bulkDiscountPercent: bd,
                        gstPercent: gst,
                        publishedById: body.publishedById || null,
                        publishedAt: publishDate,
                    },
                });
                records.push(hist);
            }
            return records;
        });
        const dateIST = (0, date_utils_1.toISTDateString)(publishDate);
        return {
            success: true,
            date: dateIST,
            dateIST,
            message: `Updated prices for ${results.length} products on ${dateIST}`,
            recordsCount: results.length,
        };
    }
};
exports.PricingService = PricingService;
exports.PricingService = PricingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PricingService);
//# sourceMappingURL=pricing.service.js.map