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
      deliveryDate: toISTDateString(b.procuredAt),
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

      const computedWeight = dto.totalWeightKg !== undefined
        ? Number(dto.totalWeightKg)
        : (dto.items || []).reduce((sum, it) => sum + (Number(it.qty) || 0), 0);

      const computedProduceAmount = dto.produceAmount !== undefined
        ? Number(dto.produceAmount)
        : (dto.items || []).reduce((sum, it) => sum + ((Number(it.qty) || 0) * (Number(it.rate) || 0)), 0);

      const computedTransport = Number(dto.transportAmount) || 0;
      const computedTotalPaid = dto.totalAmountPaid !== undefined
        ? Number(dto.totalAmountPaid)
        : (dto.totalAmount !== undefined ? Number(dto.totalAmount) : (computedProduceAmount + computedTransport));

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
          totalWeightKg: computedWeight,
          produceAmount: computedProduceAmount,
          transportAmount: computedTransport,
          totalAmountPaid: computedTotalPaid,
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
            const rawQty: any = item.qty;
            const parsedQty = typeof rawQty === 'string'
              ? (parseFloat(rawQty.replace(/[^0-9.]/g, '')) || 0)
              : (Number(rawQty) || 0);

            await tx.warehouseInventory.upsert({
              where: {
                warehouseId_productId: {
                  warehouseId: dto.destinationWarehouseId,
                  productId: matchingProduct.id,
                },
              },
              update: {
                currentQty: { increment: parsedQty },
              },
              create: {
                warehouseId: dto.destinationWarehouseId,
                productId: matchingProduct.id,
                currentQty: parsedQty,
                reservedQty: 0,
                unit: item.unit || 'kg',
              },
            });
          }
        }
      }

      return {
        ...created,
        deliveryDate: toISTDateString(created.procuredAt),
        procuredAtFormatted: toISTDateString(created.procuredAt),
        createdAtFormatted: toISTFullString(created.createdAt),
      };
    });
  }

  async delete(id: string) {
    const existing = await this.prisma.procurementBill.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Procurement bill #${id} not found`);
    }
    await this.prisma.procurementBill.delete({ where: { id } });
    return { success: true, message: `Procurement bill #${id} deleted` };
  }
}
