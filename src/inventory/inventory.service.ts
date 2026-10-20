import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AdjustStockDto } from './dto/adjust-stock.dto';
import { toISTFullString } from '../common/date-utils';

@Injectable()
export class InventoryService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(warehouseId?: string) {
    const where: any = {};
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
      updatedAtFormatted: toISTFullString(item.updatedAt),
    }));
  }

  async adjustStock(dto: AdjustStockDto) {
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
      } else if (dto.action === 'REDUCE') {
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
      updatedAtFormatted: toISTFullString(updated.updatedAt),
    };
  }
}
