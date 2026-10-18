import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { toISTDateString, toISTFullString } from '../common/date-utils';

function parseDateRange(dateStr?: string) {
  if (!dateStr) {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
    return { start, end };
  }
  let d: Date;
  if (dateStr.includes('/')) {
    const [day, month, year] = dateStr.split('/').map(Number);
    d = new Date(year, month - 1, day);
  } else {
    d = new Date(dateStr);
  }
  if (isNaN(d.getTime())) {
    d = new Date();
  }
  const start = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0);
  const end = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
  return { start, end };
}

@Injectable()
export class PricingService {
  constructor(private readonly prisma: PrismaService) {}

  async getPricesByDate(date?: string) {
    const formattedDate = date || toISTDateString(new Date());
    const { start, end } = parseDateRange(date);

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    const isPastDate = end < todayStart;

    // 1. Get all base products
    const products = await this.prisma.product.findMany({
      orderBy: { id: 'asc' },
    });

    // 2. Find daily price history entries published ON or BEFORE this target date
    // Ordered by publishedAt desc, id desc so the most recent publish for that date always wins
    const historyEntries = await this.prisma.dailyPriceHistory.findMany({
      where: {
        publishedAt: {
          lte: end,
        },
      },
      orderBy: [
        { publishedAt: 'desc' },
        { id: 'desc' },
      ],
    });

    // Map latest history entry per product effective as of this target date
    const historyMap = new Map<string, any>();
    for (const h of historyEntries) {
      if (!historyMap.has(h.productId)) {
        historyMap.set(h.productId, h);
      }
    }

    // Merge history pricing with product details so each date gets its own independent pricing snapshot
    const merged = products.map((p) => {
      const h = historyMap.get(p.id);
      // For past dates without any recorded pricing on or before that date, do NOT leak today's future rates
      const effectiveRetailPrice = h 
        ? h.retailPrice 
        : (isPastDate ? null : p.retailPrice);
      const effectiveMarketPrice = h 
        ? h.retailMarketPrice 
        : (isPastDate ? null : p.retailMarketPrice);

      return {
        id: p.id,
        productId: p.id,
        name: p.name,
        kannadaName: p.kannadaName,
        categoryId: p.categoryId,
        retailUnit: p.retailUnit,
        retailPrice: effectiveRetailPrice,
        retailMarketPrice: effectiveMarketPrice,
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
      dateIST: toISTDateString(start),
      timestampIST: toISTFullString(new Date()),
      entries: merged,
    };
  }

  async batchPublishPrices(body: { date?: string; publishedById?: string; prices?: any[]; items?: any[]; products?: any[] }) {
    const rawPrices = body.prices || body.items || body.products;
    if (!Array.isArray(rawPrices) || rawPrices.length === 0) {
      throw new BadRequestException('prices or items array is required');
    }

    // Parse effective target date
    let publishDate = new Date();
    if (body.date) {
      let parsed: Date;
      if (body.date.includes('/')) {
        const [day, month, year] = body.date.split('/').map(Number);
        parsed = new Date(year, month - 1, day, 12, 0, 0);
      } else {
        parsed = new Date(body.date);
        // Normalize time to noon so timezone shifts don't move calendar day
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

    const targetDayStart = new Date(publishDate);
    targetDayStart.setHours(0, 0, 0, 0);
    const targetDayEnd = new Date(publishDate);
    targetDayEnd.setHours(23, 59, 59, 999);

    const isToday = publishDate >= todayStart && publishDate <= todayEnd;

    const results = await this.prisma.$transaction(async (tx) => {
      const records = [];

      for (const p of rawPrices) {
        const prodId = p.productId || p.id;
        if (!prodId) continue;
        const rp = parseFloat(p.retailPrice) || 40.0;
        const rmp = parseFloat(p.retailMarketPrice) || Math.round(rp * 1.3);
        const bq = parseFloat(p.bulkMinQty) || 0;
        const bd = parseFloat(p.bulkDiscountPercent) || 0;
        const gst = parseFloat(p.gstPercent) || 0;

        // If publishing for current or upcoming run, update active product catalog baseline immediately
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

        // Cleanly delete any existing history entry for this product on this target day
        // This ensures that republishing prices for the same date always cleanly replaces the earlier entry
        await tx.dailyPriceHistory.deleteMany({
          where: {
            productId: prodId,
            publishedAt: {
              gte: targetDayStart,
              lte: targetDayEnd,
            },
          },
        });

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
