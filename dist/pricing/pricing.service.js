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
let PricingService = class PricingService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getPricesByDate(date) {
        const formattedDate = date || (0, date_utils_1.toISTDateString)(new Date());
        const products = await this.prisma.product.findMany({
            select: {
                id: true,
                name: true,
                retailUnit: true,
                retailPrice: true,
                retailMarketPrice: true,
                bulkMinQty: true,
                bulkDiscountPercent: true,
                origin: true,
                gstPercent: true,
            },
            orderBy: { id: 'asc' },
        });
        return {
            date: formattedDate,
            dateIST: formattedDate,
            timestampIST: (0, date_utils_1.toISTFullString)(new Date()),
            entries: products,
        };
    }
    async batchPublishPrices(body) {
        const rawPrices = body.prices || body.items;
        if (!Array.isArray(rawPrices) || rawPrices.length === 0) {
            throw new common_1.BadRequestException('prices or items array is required');
        }
        const publishDate = new Date();
        const results = await this.prisma.$transaction(async (tx) => {
            const records = [];
            for (const p of rawPrices) {
                if (!p.productId)
                    continue;
                const rp = parseFloat(p.retailPrice) || 40.0;
                const rmp = parseFloat(p.retailMarketPrice) || Math.round(rp * 1.3);
                const bq = parseFloat(p.bulkMinQty) || 0;
                const bd = parseFloat(p.bulkDiscountPercent) || 0;
                const gst = parseFloat(p.gstPercent) || 0;
                await tx.product.update({
                    where: { id: p.productId },
                    data: {
                        retailPrice: rp,
                        retailMarketPrice: rmp,
                        bulkMinQty: bq,
                        bulkDiscountPercent: bd,
                        gstPercent: gst,
                    },
                });
                const hist = await tx.dailyPriceHistory.create({
                    data: {
                        productId: p.productId,
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