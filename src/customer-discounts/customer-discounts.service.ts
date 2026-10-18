import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface CreateCustomerDiscountDto {
  userId: string; // Customer phone or ID
  userName?: string;
  discountType: 'FIXED' | 'PERCENTAGE';
  discountValue: number; // e.g. 50 (₹) or 15 (%)
  minOrderAmount?: number;
  maxUses?: number; // default 1
  expiresAt: string; // ISO date or YYYY-MM-DD
  issueReason?: string; // Audit reason
}

@Injectable()
export class CustomerDiscountsService {
  constructor(private readonly prisma: PrismaService) {}

  async createDiscount(staffUser: any, dto: CreateCustomerDiscountDto) {
    if (!dto.userId) {
      throw new BadRequestException('Target customer phone or ID is required');
    }

    const val = Number(dto.discountValue);
    if (!val || val <= 0) {
      throw new BadRequestException('Discount value must be greater than zero');
    }

    if (dto.discountType === 'PERCENTAGE' && val > 100) {
      throw new BadRequestException('Percentage discount cannot exceed 100%');
    }

    const exp = new Date(dto.expiresAt);
    if (isNaN(exp.getTime()) || exp.getTime() <= Date.now()) {
      throw new BadRequestException('Expiry date must be in the future');
    }

    // Generate unique readable reward code
    const cleanPhone = dto.userId.slice(-4);
    const rand = Math.floor(1000 + Math.random() * 9000);
    const code = `REWARD-${cleanPhone}-${rand}`;

    return this.prisma.customerDiscount.create({
      data: {
        code,
        userId: dto.userId,
        userName: dto.userName || 'Valued Resident',
        discountType: dto.discountType,
        discountValue: val,
        minOrderAmount: Number(dto.minOrderAmount) || 0,
        maxUses: Number(dto.maxUses) || 1,
        usedCount: 0,
        expiresAt: exp,
        status: 'ACTIVE',
        issuedById: staffUser?.id || staffUser?.phone || 'staff',
        issuedByName: staffUser?.name || 'Freshioz Admin',
        issueReason: dto.issueReason || 'Customer Feedback Reward',
      },
    });
  }

  async getCustomerDiscounts(user: any) {
    const userId = user.phone || user.id;
    const now = new Date();

    // Auto-expire discounts that passed expiry date
    await this.prisma.customerDiscount.updateMany({
      where: {
        userId,
        status: 'ACTIVE',
        expiresAt: { lt: now },
      },
      data: {
        status: 'EXPIRED',
      },
    });

    return this.prisma.customerDiscount.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getAdminDiscounts(query?: { status?: string; userId?: string }) {
    const where: any = {};
    if (query?.status && query.status !== 'ALL') where.status = query.status;
    if (query?.userId) where.userId = query.userId;

    // Auto-update expired records
    await this.prisma.customerDiscount.updateMany({
      where: {
        status: 'ACTIVE',
        expiresAt: { lt: new Date() },
      },
      data: { status: 'EXPIRED' },
    });

    return this.prisma.customerDiscount.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async revokeDiscount(id: string, staffUser: any) {
    const discount = await this.prisma.customerDiscount.findUnique({ where: { id } });
    if (!discount) throw new NotFoundException(`Reward discount #${id} not found`);

    if (discount.status === 'REDEEMED') {
      throw new BadRequestException('Cannot revoke a discount that has already been redeemed');
    }

    return this.prisma.customerDiscount.update({
      where: { id },
      data: {
        status: 'REVOKED',
        revokedAt: new Date(),
        revokedById: staffUser?.id || staffUser?.phone || 'staff',
      },
    });
  }

  // Validate discount at checkout
  async validateDiscount(code: string, user: any, cartSubtotal: number) {
    const userId = user.phone || user.id;
    const discount = await this.prisma.customerDiscount.findUnique({
      where: { code: code.trim().toUpperCase() },
    });

    if (!discount) {
      throw new NotFoundException('Invalid discount or reward code');
    }

    // Strictly account-bound verification
    if (discount.userId !== userId && discount.userId !== user.phone && discount.userId !== user.id) {
      throw new ForbiddenException('This reward discount is exclusive to another customer account');
    }

    if (discount.status === 'REVOKED') {
      throw new BadRequestException('This discount has been revoked');
    }

    if (discount.status === 'REDEEMED' || discount.usedCount >= discount.maxUses) {
      throw new BadRequestException('This discount has already reached its maximum usage limit');
    }

    if (new Date(discount.expiresAt).getTime() <= Date.now()) {
      await this.prisma.customerDiscount.update({
        where: { id: discount.id },
        data: { status: 'EXPIRED' },
      });
      throw new BadRequestException('This reward discount has expired');
    }

    if (discount.minOrderAmount > 0 && cartSubtotal < discount.minOrderAmount) {
      throw new BadRequestException(
        `Minimum cart order amount of ₹${discount.minOrderAmount} required to use this reward (current: ₹${cartSubtotal})`,
      );
    }

    let calculatedDeduction = 0;
    if (discount.discountType === 'PERCENTAGE') {
      calculatedDeduction = Number(((cartSubtotal * discount.discountValue) / 100).toFixed(2));
    } else {
      calculatedDeduction = Math.min(cartSubtotal, discount.discountValue);
    }

    return {
      isValid: true,
      code: discount.code,
      discountId: discount.id,
      discountType: discount.discountType,
      discountValue: discount.discountValue,
      calculatedDeduction,
      minOrderAmount: discount.minOrderAmount,
      expiresAt: discount.expiresAt,
      issueReason: discount.issueReason,
    };
  }
}
