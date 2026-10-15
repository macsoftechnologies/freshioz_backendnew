import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { toISTDateString, toISTFullString } from '../common/date-utils';

@Injectable()
export class PricingService {
  constructor(private readonly prisma: PrismaService) {}

  async getPricesByDate(date?: string) {
    const formattedDate = date || toISTDateString(new Date());

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
      timestampIST: toISTFullString(new Date()),
      entries: products,
    };
  }

  async batchPublishPrices(body: { date?: string; publishedById?: string; prices?: any[]; items?: any[] }) {
    const rawPrices = body.prices || body.items;
    if (!Array.isArray(rawPrices) || rawPrices.length === 0) {
      throw new BadRequestException('prices or items array is required');
    }

    const publishDate = new Date();

    const results = await this.prisma.$transaction(async (tx) => {
      const records = [];

      for (const p of rawPrices) {
        if (!p.productId) continue;
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

    const dateIST = toISTDateString(publishDate);
    return {
      success: true,
      date: dateIST,
      dateIST,
      message: `Updated prices for ${results.length} products on ${dateIST}`,
      recordsCount: results.length,
    };
  }
}
