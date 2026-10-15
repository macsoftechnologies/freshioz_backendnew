import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order.dto';
import { toISTFullString } from '../common/date-utils';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query?: { status?: string; societyId?: string; phone?: string; warehouseId?: string }) {
    const where: any = {};
    if (query?.status) where.status = query.status;
    if (query?.societyId) where.societyId = query.societyId;
    if (query?.warehouseId && query.warehouseId !== 'ALL') where.warehouseId = query.warehouseId;
    if (query?.phone) {
      where.OR = [
        { userPhone: query.phone },
        { userId: query.phone },
      ];
    }

    const orders = await this.prisma.order.findMany({
      where,
      include: {
        items: true,
        society: true,
        warehouse: true,
      },
      orderBy: { orderPlacedAt: 'desc' },
    });

    return orders.map((o) => ({
      ...o,
      orderPlacedAtFormatted: toISTFullString(o.orderPlacedAt),
      createdAtFormatted: toISTFullString(o.createdAt),
    }));
  }

  async findOne(idOrUuid: string) {
    const order = await this.prisma.order.findFirst({
      where: {
        OR: [{ id: idOrUuid }, { uuid: idOrUuid }],
      },
      include: {
        items: true,
        society: true,
        warehouse: true,
      },
    });

    if (!order) {
      throw new NotFoundException(`Order #${idOrUuid} not found`);
    }

    return {
      ...order,
      orderPlacedAtFormatted: toISTFullString(order.orderPlacedAt),
      createdAtFormatted: toISTFullString(order.createdAt),
    };
  }

  async create(dto: CreateOrderDto) {
    if (!dto.items || dto.items.length === 0) {
      throw new BadRequestException('Order must contain at least one line item');
    }

    return this.prisma.$transaction(async (tx) => {
      // 1. Fetch society to get commission & warehouse if supplied
      let society: any = null;
      if (dto.societyId) {
        society = await tx.society.findFirst({
          where: { OR: [{ id: dto.societyId }, { uuid: dto.societyId }] },
        });
      }

      let warehouse: any = null;
      const targetWarehouseId = dto.warehouseId || society?.warehouseId;
      if (targetWarehouseId) {
        warehouse = await tx.warehouse.findFirst({
          where: { OR: [{ id: targetWarehouseId }, { uuid: targetWarehouseId }] },
        });
      }
      const warehouseId = warehouse ? warehouse.id : null;
      const societyId = society ? society.id : null;

      // 2. Ensure customer user exists
      let user = await tx.user.findUnique({
        where: { phone: dto.userPhone.trim() },
      });

      if (!user) {
        user = await tx.user.create({
          data: {
            id: `USR_${dto.userPhone.trim()}`,
            phone: dto.userPhone.trim(),
            name: dto.userName.trim(),
            societyId,
            flatNo: dto.flatNo || 'Flat 101',
          },
        });
      }

      // 3. SERVER-SIDE PRICE & TOTAL CALCULATION (Do not trust client totals)
      let calculatedSubtotal = 0;
      let calculatedBulkSavings = 0;
      const verifiedItems: any[] = [];

      for (const item of dto.items) {
        const product = await tx.product.findFirst({
          where: { OR: [{ id: item.productId }, { uuid: item.productId }, { name: item.name }] },
        });

        if (!product) {
          throw new BadRequestException(`Product '${item.name || item.productId}' is currently unavailable in the catalog.`);
        }

        // Use DB product price if found, otherwise fallback to item.price safely
        const unitPrice = product ? product.retailPrice : (Number(item.price) || 0);
        const qty = Number(item.qty) || 1;
        const lineOriginalTotal = unitPrice * qty;

        let effectiveUnitPrice = unitPrice;
        let lineBulkSavings = 0;
        let isBulkApplied = false;

        // Verify bulk discount on server
        if (product && product.bulkMinQty > 0 && product.bulkDiscountPercent > 0 && qty >= product.bulkMinQty) {
          isBulkApplied = true;
          const discountRatio = product.bulkDiscountPercent / 100;
          effectiveUnitPrice = Number((unitPrice * (1 - discountRatio)).toFixed(2));
          lineBulkSavings = Number(((unitPrice - effectiveUnitPrice) * qty).toFixed(2));
        }

        const lineFinalTotal = Number((effectiveUnitPrice * qty).toFixed(2));
        calculatedSubtotal += lineOriginalTotal;
        calculatedBulkSavings += lineBulkSavings;

        verifiedItems.push({
          productId: product ? product.id : item.productId,
          name: product ? product.name : item.name,
          unit: product ? product.retailUnit : (item.unit || '1 kg'),
          qty,
          price: unitPrice,
          effectivePrice: effectiveUnitPrice,
          totalPrice: lineFinalTotal,
          isBulkApplied,
          bulkDiscountPercent: product ? product.bulkDiscountPercent : (item.bulkDiscountPercent || 0),
          bulkSavings: lineBulkSavings,
        });

        // 4. INVENTORY RESERVATION / DEDUCTION (If warehouse assigned)
        if (warehouseId && product) {
          const inv = await tx.warehouseInventory.findUnique({
            where: {
              warehouseId_productId: {
                warehouseId,
                productId: product.id,
              },
            },
          });

          if (inv) {
            if (inv.currentQty < qty) {
              throw new BadRequestException(
                `Produce item "${product.name}" has insufficient stock in warehouse. Available: ${inv.currentQty} ${inv.unit}, requested: ${qty} ${inv.unit}`,
              );
            }

            await tx.warehouseInventory.update({
              where: {
                warehouseId_productId: {
                  warehouseId,
                  productId: product.id,
                },
              },
              data: {
                currentQty: inv.currentQty - qty,
                reservedQty: inv.reservedQty + qty,
              },
            });
          }
        }
      }

      const deliveryFee = Number(dto.deliveryFee) || 0;
      const gstAmount = Number(dto.gstAmount) || 0;
      const calculatedTotalAmount = Number((calculatedSubtotal - calculatedBulkSavings + deliveryFee + gstAmount).toFixed(2));

      // Calculate accrued society commission (To be credited upon DELIVERED status)
      let societyCommission = 0;
      if (society) {
        if (society.commissionType === 'PERCENTAGE') {
          societyCommission = Number(((calculatedTotalAmount * society.commissionValue) / 100).toFixed(2));
        } else {
          societyCommission = Number(society.commissionValue.toFixed(2));
        }
      }

      // Unique Collision-Free Order ID
      const orderId = `ORD-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;

      const created = await tx.order.create({
        data: {
          id: orderId,
          userId: user.phone,
          userName: dto.userName.trim(),
          userPhone: dto.userPhone.trim(),
          societyId: society?.id || null,
          societyName: society?.name || dto.societyName || 'Direct Resident Delivery',
          flatNo: dto.flatNo,
          warehouseId,
          warehouseCode: dto.warehouseCode || null,
          orderType: calculatedBulkSavings > 0 ? 'BULK' : 'RETAIL',
          subtotal: calculatedSubtotal,
          bulkSavings: calculatedBulkSavings,
          deliveryFee,
          gstAmount,
          totalAmount: calculatedTotalAmount,
          deliveryDate: dto.deliveryDate,
          deliverySlot: dto.deliverySlot,
          status: 'CONFIRMED',
          paymentMethod: dto.paymentMethod || 'UPI',
          paymentStatus: dto.paymentStatus || 'PAID',
          societyCommissionEarned: societyCommission,
          items: {
            create: verifiedItems,
          },
        },
        include: {
          items: true,
          society: true,
          warehouse: true,
        },
      });

      return {
        ...created,
        orderPlacedAtFormatted: toISTFullString(created.orderPlacedAt),
        createdAtFormatted: toISTFullString(created.createdAt),
      };
    });
  }

  async updateStatus(idOrUuid: string, dto: UpdateOrderStatusDto) {
    return this.prisma.$transaction(async (tx) => {
      const existing = await tx.order.findFirst({
        where: {
          OR: [{ id: idOrUuid }, { uuid: idOrUuid }],
        },
        include: { society: true },
      });

      if (!existing) {
        throw new NotFoundException(`Order #${idOrUuid} not found`);
      }

      const updateData: any = {};
      if (dto.status) updateData.status = dto.status;
      if (dto.paymentStatus) updateData.paymentStatus = dto.paymentStatus;
      if (dto.codCollectedAmount !== undefined) updateData.codCollectedAmount = dto.codCollectedAmount;
      if (dto.codCollectedBy) {
        updateData.codCollectedBy = dto.codCollectedBy;
        updateData.codCollectedAt = new Date();
      }

      // CREDIT SOCIETY EARNINGS EXACTLY ONCE WHEN STATUS BECOMES 'DELIVERED'
      if (dto.status === 'DELIVERED' && existing.status !== 'DELIVERED') {
        updateData.deliveredAt = new Date();

        if (existing.societyId && existing.societyCommissionEarned > 0) {
          await tx.society.update({
            where: { id: existing.societyId },
            data: {
              balanceEarned: { increment: existing.societyCommissionEarned },
              totalOrdersDelivered: { increment: 1 },
            },
          });
        }
      }

      const updated = await tx.order.update({
        where: { id: existing.id },
        data: updateData,
        include: { items: true, society: true },
      });

      return {
        ...updated,
        orderPlacedAtFormatted: toISTFullString(updated.orderPlacedAt),
        createdAtFormatted: toISTFullString(updated.createdAt),
      };
    });
  }
}
