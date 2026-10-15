import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProcurementBillDto } from './dto/create-procurement-bill.dto';
import { toISTDateString, toISTTimeString, toISTFullString } from '../common/date-utils';

@Injectable()
export class ProcurementService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const bills = await this.prisma.procurementBill.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        vendor: true,
      },
    });

    return bills.map((b) => ({
      ...b,
      procuredAtFormatted: toISTDateString(b.procuredAt),
      procuredAtTime: toISTTimeString(b.procuredAt),
      createdAtFormatted: toISTFullString(b.createdAt),
    }));
  }

  async findOne(id: string) {
    const bill = await this.prisma.procurementBill.findUnique({
      where: { id },
      include: { vendor: true },
    });
    if (!bill) {
      throw new NotFoundException(`Procurement bill #${id} not found`);
    }
    return {
      ...bill,
      procuredAtFormatted: toISTDateString(bill.procuredAt),
      procuredAtTime: toISTTimeString(bill.procuredAt),
      createdAtFormatted: toISTFullString(bill.createdAt),
    };
  }

  async create(dto: CreateProcurementBillDto) {
    return this.prisma.$transaction(async (tx) => {
      const billNumber = dto.billNumber || `APMC-${Date.now().toString().slice(-6)}`;
      const billId = `PB_${Date.now()}`;

      const created = await tx.procurementBill.create({
        data: {
          id: billId,
          billNumber,
          vendorId: dto.vendorId || null,
          vendorName: dto.vendorName,
          mandiLocation: dto.mandiLocation,
          destinationWarehouseId: dto.destinationWarehouseId,
          destinationName: dto.destinationName,
          paymentMode: dto.paymentMode || 'IMPS_TRANSFER',
          totalWeightKg: dto.totalWeightKg,
          produceAmount: dto.produceAmount,
          transportAmount: dto.transportAmount || 0,
          totalAmountPaid: dto.totalAmountPaid,
          receiptPhoto: dto.receiptPhoto || null,
          procuredBy: dto.procuredBy || 'Admin Procurement Desk',
          slot: dto.slot || 'Morning Fresh Slot',
          items: dto.items as any,
        },
      });

      // AUTO-INWARD PRODUCE INTO WAREHOUSE INVENTORY
      if (dto.destinationWarehouseId && Array.isArray(dto.items)) {
        for (const item of dto.items) {
          const matchingProduct = await tx.product.findFirst({
            where: {
              name: { contains: item.name, mode: 'insensitive' },
            },
          });

          if (matchingProduct) {
            await tx.warehouseInventory.upsert({
              where: {
                warehouseId_productId: {
                  warehouseId: dto.destinationWarehouseId,
                  productId: matchingProduct.id,
                },
              },
              update: {
                currentQty: { increment: Number(item.qty) || 0 },
              },
              create: {
                warehouseId: dto.destinationWarehouseId,
                productId: matchingProduct.id,
                currentQty: Number(item.qty) || 0,
                reservedQty: 0,
                unit: item.unit || 'kg',
              },
            });
          }
        }
      }

      return {
        ...created,
        procuredAtFormatted: toISTDateString(created.procuredAt),
        createdAtFormatted: toISTFullString(created.createdAt),
      };
    });
  }
}
