import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DELIVERY_CONFIG } from './delivery.constants';

/**
 * PUBLIC, read-only, explicit-field catalog. Nothing here may contain PII,
 * banking data, balances, commission rates, leads, employees or orders.
 * Uses `select` (allow-list) so new DB columns are never leaked by accident.
 */
@Injectable()
export class CatalogService {
  constructor(private readonly prisma: PrismaService) {}

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
        category: category?.name ?? 'Vegetables', // keeps existing UI contract (p.category = name)
      })),
      societies,
      warehouses,
      deliveryConfig: DELIVERY_CONFIG,
      syncedAt: new Date().toISOString(),
    };
  }
}
