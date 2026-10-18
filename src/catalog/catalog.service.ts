import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DELIVERY_CONFIG } from './delivery.constants';

/**
 * PUBLIC, read-only, explicit-field catalog. Nothing here may contain PII,
 * banking data, balances, commission rates, leads, employees or orders.
 * Uses `select` (allow-list) so new DB columns are never leaked by accident.
 */
function parseTargetDeliveryDateRange(dateStr?: string) {
  if (dateStr) {
    let d: Date;
    if (dateStr.includes('/')) {
      const [day, month, year] = dateStr.split('/').map(Number);
      d = new Date(year, month - 1, day);
    } else {
      d = new Date(dateStr);
    }
    if (isNaN(d.getTime())) d = new Date();
    const start = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0);
    const end = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
    return { start, end, dateObj: d };
  }

  // Calculate IST current time
  const now = new Date();
  const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
  const istNow = new Date(utcMs + 5.5 * 3600000);

  // If IST hour >= 21 (9 PM), orders close for tomorrow and move to day after tomorrow (+2)
  // Otherwise, active delivery is tomorrow (+1)
  const daysToAdd = istNow.getHours() >= 21 ? 2 : 1;
  const d = new Date(istNow);
  d.setDate(d.getDate() + daysToAdd);

  const start = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0);
  const end = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
  return { start, end, dateObj: d };
}

@Injectable()
export class CatalogService {
  constructor(private readonly prisma: PrismaService) {}

  async getPublicCatalog(targetDate?: string) {
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

    // Build latest history mapping per product for target delivery date
    const historyMap = new Map<string, any>();
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
          category: category?.name ?? 'Vegetables', // keeps existing UI contract (p.category = name)
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
      deliveryConfig: DELIVERY_CONFIG,
      activeDeliveryDate: dateObj.toISOString().slice(0, 10),
      syncedAt: new Date().toISOString(),
    };
  }
}
