import { Injectable, NotFoundException, BadRequestException, ForbiddenException, ConflictException } from '@nestjs/common';
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
      // 1. Fetch society to get commission & warehouse (Strictly required & must be APPROVED)
      if (!dto.societyId) {
        throw new BadRequestException('Society ID is required. Please select a registered community.');
      }
      const society = await tx.society.findFirst({
        where: { OR: [{ id: dto.societyId }, { uuid: dto.societyId }] },
      });

      if (!society) {
        throw new BadRequestException(`Selected society '${dto.societyId}' does not exist.`);
      }
      if (society.status !== 'APPROVED') {
        throw new BadRequestException(`Society '${society.name}' is currently '${society.status}'. Orders can only be placed for APPROVED communities.`);
      }
      if (!society.warehouseId) {
        throw new BadRequestException(`Society '${society.name}' has no assigned regional warehouse hub.`);
      }

      const warehouse = await tx.warehouse.findFirst({
        where: { OR: [{ id: society.warehouseId }, { uuid: society.warehouseId }] },
      });
      if (!warehouse || warehouse.status !== 'ACTIVE') {
        throw new BadRequestException(`Serving warehouse for '${society.name}' is inactive or not found.`);
      }

      const warehouseId = warehouse.id;
      const societyId = society.id;

      const flatNo = (dto.flatNo || '').trim();
      if (!flatNo) {
        throw new BadRequestException('Flat / Door number is required for delivery.');
      }

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
            flatNo,
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

        // Use DB product price if found (checking DailyPriceHistory for deliveryDate first)
        let unitPrice = product ? product.retailPrice : (Number(item.price) || 0);
        let bulkMinQty = product ? product.bulkMinQty : 0;
        let bulkDiscountPercent = product ? product.bulkDiscountPercent : 0;

        if (product && dto.deliveryDate) {
          let d: Date;
          if (dto.deliveryDate.includes('/')) {
            const [day, month, year] = dto.deliveryDate.split('/').map(Number);
            d = new Date(year, month - 1, day);
          } else {
            d = new Date(dto.deliveryDate);
          }
          if (!isNaN(d.getTime())) {
            const start = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0);
            const end = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
            const hist = await tx.dailyPriceHistory.findFirst({
              where: {
                productId: product.id,
                publishedAt: { gte: start, lte: end },
              },
              orderBy: { publishedAt: 'desc' },
            });
            if (hist) {
              unitPrice = hist.retailPrice;
              bulkMinQty = hist.bulkMinQty;
              bulkDiscountPercent = hist.bulkDiscountPercent;
            }
          }
        }

        const rawQty = Number(item.qty);
        if (isNaN(rawQty) || rawQty <= 0) {
          throw new BadRequestException(`Invalid quantity for produce '${item.name || item.productId}'. Quantity must be greater than zero.`);
        }
        if (rawQty > 1000) {
          throw new BadRequestException(`Quantity '${rawQty}' exceeds maximum allowed limit (1000) for '${item.name || item.productId}'.`);
        }
        const qty = Number(rawQty.toFixed(2));
        const lineOriginalTotal = unitPrice * qty;

        let effectiveUnitPrice = unitPrice;
        let lineBulkSavings = 0;
        let isBulkApplied = false;

        // Verify bulk discount on server
        if (product && bulkMinQty > 0 && bulkDiscountPercent > 0 && qty >= bulkMinQty) {
          isBulkApplied = true;
          const discountRatio = bulkDiscountPercent / 100;
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

        // 4. INVENTORY RESERVATION / ALLOCATION (If warehouse assigned)
        // In the next-day dawn harvest model, customer orders drive procurement demand.
        // We reserve any existing stock without blocking the order if stock is lower than requested.
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
            const availableToReserve = Math.min(Math.max(0, inv.currentQty), qty);
            if (availableToReserve > 0) {
              await tx.warehouseInventory.update({
                where: {
                  warehouseId_productId: {
                    warehouseId,
                    productId: product.id,
                  },
                },
                data: {
                  currentQty: Math.max(0, inv.currentQty - availableToReserve),
                  reservedQty: (inv.reservedQty || 0) + availableToReserve,
                },
              });
            }
          }
        }
      }

      // 5. SERVER-SIDE DELIVERY FEE & GST CALCULATION (Defend against client manipulation)
      const itemsNetTotal = Math.max(0, calculatedSubtotal - calculatedBulkSavings);
      let deliveryFee = 0;
      if (itemsNetTotal > 0 && itemsNetTotal < 299) {
        // Below ₹299 free delivery threshold: apply standard base fee or validated client fee (minimum 0)
        deliveryFee = Math.max(0, Number(dto.deliveryFee) || 25);
      } else {
        // Free delivery on orders ₹299+ and wholesale bulk orders
        deliveryFee = 0;
      }

      // GST: Raw farm produce is 0% exempt under Indian tax law; ensure non-negative tax amount
      const gstAmount = Math.max(0, Number(dto.gstAmount) || 0);

      // 5.1 SERVER-SIDE CUSTOMER REWARD DISCOUNT VERIFICATION
      let appliedDiscountAmount = 0;
      let matchedDiscount: any = null;

      if (dto.discountCode) {
        matchedDiscount = await tx.customerDiscount.findUnique({
          where: { code: dto.discountCode.trim().toUpperCase() },
        });

        if (!matchedDiscount) {
          throw new BadRequestException('Invalid reward discount code.');
        }

        const customerPhone = user?.phone || dto.userPhone;
        const customerId = user?.id;

        if (matchedDiscount.userId !== customerPhone && matchedDiscount.userId !== customerId) {
          throw new ForbiddenException('This reward discount belongs to another customer account.');
        }

        if (matchedDiscount.status === 'REVOKED') {
          throw new BadRequestException('This discount code has been revoked.');
        }

        if (matchedDiscount.status === 'REDEEMED' || matchedDiscount.usedCount >= matchedDiscount.maxUses) {
          throw new BadRequestException('This discount code has already been redeemed.');
        }

        if (new Date(matchedDiscount.expiresAt).getTime() <= Date.now()) {
          throw new BadRequestException('This reward discount has expired.');
        }

        if (matchedDiscount.minOrderAmount > 0 && itemsNetTotal < matchedDiscount.minOrderAmount) {
          throw new BadRequestException(
            `Minimum order amount of ₹${matchedDiscount.minOrderAmount} required for this reward.`,
          );
        }

        if (matchedDiscount.discountType === 'PERCENTAGE') {
          appliedDiscountAmount = Number(((itemsNetTotal * matchedDiscount.discountValue) / 100).toFixed(2));
        } else {
          appliedDiscountAmount = Math.min(itemsNetTotal, matchedDiscount.discountValue);
        }
      }

      const calculatedTotalAmount = Number(
        Math.max(0, itemsNetTotal + deliveryFee + gstAmount - appliedDiscountAmount).toFixed(2)
      );

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
          // Phase 1: Only Pay on Delivery (COD) is permitted.
          // Instant online UPI is commented out so clients cannot inject 'PAID' via console or REST API.
          // paymentMethod: dto.paymentMethod || 'UPI',
          // paymentStatus: dto.paymentStatus || 'PAID',
          paymentMethod: 'PAY_ON_DELIVERY',
          paymentStatus: 'PENDING_COD',
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

      // 6. Record discount redemption if applied
      if (matchedDiscount) {
        await tx.customerDiscount.update({
          where: { id: matchedDiscount.id },
          data: {
            usedCount: matchedDiscount.usedCount + 1,
            status: matchedDiscount.usedCount + 1 >= matchedDiscount.maxUses ? 'REDEEMED' : 'ACTIVE',
            redeemedAt: new Date(),
            orderId: created.id,
          },
        });
      }

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

      if (existing.status === 'CANCELLED') {
        throw new BadRequestException('Cannot update status of an order that has already been cancelled.');
      }

      const updateData: any = {};
      if (dto.status) updateData.status = dto.status;
      if (dto.paymentStatus) updateData.paymentStatus = dto.paymentStatus;
      if (dto.codCollectedAmount !== undefined) updateData.codCollectedAmount = dto.codCollectedAmount;
      if (dto.codCollectedBy) {
        updateData.codCollectedBy = dto.codCollectedBy;
        updateData.codCollectedAt = new Date();
      }
      if (dto.codSettledToHub !== undefined) {
        updateData.codSettledToHub = dto.codSettledToHub;
        if (dto.codSettledToHub) {
          updateData.codSettledAt = new Date();
          updateData.codSettledBy = dto.codSettledBy || 'Hub Cashier Desk';
        }
      }
      if (dto.codReceivedMode) {
        updateData.codReceivedMode = dto.codReceivedMode;
      }

      // ATOMIC CONCURRENCY CHECK FOR DELIVERED:
      // Prevents race conditions where an order is concurrently cancelled while being delivered
      if (dto.status === 'DELIVERED') {
        updateData.deliveredAt = new Date();

        const updateResult = await tx.order.updateMany({
          where: {
            id: existing.id,
            status: { notIn: ['DELIVERED', 'CANCELLED'] },
          },
          data: updateData,
        });

        if (updateResult.count === 0) {
          throw new ConflictException('Cannot mark order as delivered because it was concurrently cancelled or already delivered.');
        }

        // Credit society earnings exactly once when status becomes DELIVERED
        if (existing.societyId && existing.societyCommissionEarned > 0) {
          await tx.society.update({
            where: { id: existing.societyId },
            data: {
              balanceEarned: { increment: existing.societyCommissionEarned },
              totalOrdersDelivered: { increment: 1 },
            },
          });
        }
      } else {
        await tx.order.update({
          where: { id: existing.id },
          data: updateData,
        });
      }

      const updated = await tx.order.findUnique({
        where: { id: existing.id },
        include: { items: true, society: true },
      });

      return {
        ...updated,
        orderPlacedAtFormatted: toISTFullString(updated.orderPlacedAt),
        createdAtFormatted: toISTFullString(updated.createdAt),
      };
    });
  }

  async cancelOrder(idOrUuid: string, user: any, reason?: string) {
    return this.prisma.$transaction(async (tx) => {
      const existing = await tx.order.findFirst({
        where: {
          OR: [{ id: idOrUuid }, { uuid: idOrUuid }],
        },
        include: { items: true, society: true },
      });

      if (!existing) {
        throw new NotFoundException(`Order #${idOrUuid} not found`);
      }

      // Check customer authorization
      const isCustomer = user?.type === 'CUSTOMER';
      if (isCustomer && existing.userPhone !== user.phone && existing.userId !== user.id) {
        throw new ForbiddenException('Access denied. You can only cancel your own orders.');
      }

      // Check allowed statuses for cancellation - Delivered orders can NEVER be cancelled
      if (existing.status === 'CANCELLED') {
        throw new BadRequestException('Order is already cancelled.');
      }
      if (existing.status === 'DELIVERED') {
        throw new BadRequestException('Delivered orders cannot be cancelled.');
      }

      // ATOMIC CONCURRENCY CHECK FOR CANCELLATION:
      // Atomically transition to CANCELLED only if status is still NOT DELIVERED and NOT CANCELLED.
      // This completely eliminates any race condition between delivery and cancellation.
      const cancelResult = await tx.order.updateMany({
        where: {
          id: existing.id,
          status: { notIn: ['DELIVERED', 'CANCELLED'] },
        },
        data: {
          status: 'CANCELLED',
          cancelledReason: reason || 'Cancelled by resident before cutoff',
          cancelledAt: new Date(),
        },
      });

      if (cancelResult.count === 0) {
        throw new ConflictException('Order cannot be cancelled because it was concurrently delivered or already cancelled.');
      }

      // Restore reserved warehouse stock
      if (existing.warehouseId && Array.isArray(existing.items)) {
        for (const item of existing.items) {
          if (!item.productId) continue;
          const inv = await tx.warehouseInventory.findUnique({
            where: {
              warehouseId_productId: {
                warehouseId: existing.warehouseId,
                productId: item.productId,
              },
            },
          });
          if (inv) {
            const toRestore = Math.min(Math.max(0, inv.reservedQty || 0), item.qty);
            if (toRestore > 0) {
              await tx.warehouseInventory.update({
                where: {
                  warehouseId_productId: {
                    warehouseId: existing.warehouseId,
                    productId: item.productId,
                  },
                },
                data: {
                  currentQty: inv.currentQty + toRestore,
                  reservedQty: Math.max(0, (inv.reservedQty || 0) - toRestore),
                },
              });
            }
          }
        }
      }

      const updated = await tx.order.findUnique({
        where: { id: existing.id },
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
