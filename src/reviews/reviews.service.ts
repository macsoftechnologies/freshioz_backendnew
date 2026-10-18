import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface CreateReviewDto {
  type: 'PRODUCT' | 'DELIVERY' | 'WEBSITE';
  rating: number; // 1 to 5
  comment?: string;
  orderId?: string;
  productId?: string;
}

export interface UpdateReviewDto {
  rating?: number;
  comment?: string;
}

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  async createReview(user: any, dto: CreateReviewDto) {
    if (!user || (!user.id && !user.phone)) {
      throw new ForbiddenException('Authentication required to submit a review');
    }

    const rating = Number(dto.rating);
    if (!rating || rating < 1 || rating > 5) {
      throw new BadRequestException('Rating is required and must be between 1 and 5 stars');
    }

    const userId = user.phone || user.id;
    const userName = user.name || 'Resident';
    const userPhone = user.phone || user.id;

    if (dto.type === 'PRODUCT') {
      if (!dto.orderId) {
        throw new BadRequestException('Order reference is required for a product review');
      }
      if (!dto.productId) {
        throw new BadRequestException('Product reference is required for a product review');
      }

      // Verify order exists, belongs to user, and is DELIVERED
      const order = await this.prisma.order.findFirst({
        where: {
          OR: [{ id: dto.orderId }, { uuid: dto.orderId }],
        },
        include: { items: true },
      });

      if (!order) {
        throw new NotFoundException(`Order #${dto.orderId} not found`);
      }
      if (order.userPhone !== user.phone && order.userId !== user.id) {
        throw new ForbiddenException('You can only review products from your own orders');
      }
      if (order.status !== 'DELIVERED') {
        throw new BadRequestException('Product reviews are only available after the order has been delivered');
      }

      // Check product was purchased in this order
      const item = order.items.find(i => i.productId === dto.productId);
      if (!item) {
        throw new BadRequestException('This product was not part of the specified order');
      }

      // Prevent duplicate product review for the same order
      const existing = await this.prisma.review.findFirst({
        where: {
          type: 'PRODUCT',
          orderId: order.id,
          productId: dto.productId,
          userId,
        },
      });
      if (existing) {
        throw new BadRequestException('You have already reviewed this product for this order. You can edit your existing review.');
      }

      return this.prisma.review.create({
        data: {
          type: 'PRODUCT',
          rating,
          comment: dto.comment ? dto.comment.trim() : null,
          userId,
          userName,
          userPhone,
          orderId: order.id,
          productId: dto.productId,
          productName: item.name,
          status: 'PENDING', // Requires admin moderation before public display
        },
      });
    }

    if (dto.type === 'DELIVERY') {
      if (!dto.orderId) {
        throw new BadRequestException('Order reference is required for a delivery review');
      }

      const order = await this.prisma.order.findFirst({
        where: {
          OR: [{ id: dto.orderId }, { uuid: dto.orderId }],
        },
      });

      if (!order) {
        throw new NotFoundException(`Order #${dto.orderId} not found`);
      }
      if (order.userPhone !== user.phone && order.userId !== user.id) {
        throw new ForbiddenException('You can only review delivery for your own orders');
      }
      if (order.status !== 'DELIVERED') {
        throw new BadRequestException('Delivery reviews are only available after the order has been delivered');
      }

      // Prevent duplicate delivery review for the same order
      const existing = await this.prisma.review.findFirst({
        where: {
          type: 'DELIVERY',
          orderId: order.id,
          userId,
        },
      });
      if (existing) {
        throw new BadRequestException('You have already submitted a delivery review for this order.');
      }

      return this.prisma.review.create({
        data: {
          type: 'DELIVERY',
          rating,
          comment: dto.comment ? dto.comment.trim() : null,
          userId,
          userName,
          userPhone,
          orderId: order.id,
          status: 'PENDING',
        },
      });
    }

    if (dto.type === 'WEBSITE') {
      return this.prisma.review.create({
        data: {
          type: 'WEBSITE',
          rating,
          comment: dto.comment ? dto.comment.trim() : null,
          userId,
          userName,
          userPhone,
          status: 'PENDING',
        },
      });
    }

    throw new BadRequestException(`Invalid review type: ${dto.type}`);
  }

  async updateReview(id: string, user: any, dto: UpdateReviewDto) {
    const review = await this.prisma.review.findUnique({
      where: { id },
    });
    if (!review) {
      throw new NotFoundException(`Review #${id} not found`);
    }

    const userId = user.phone || user.id;
    if (review.userId !== userId) {
      throw new ForbiddenException('You can only edit your own reviews');
    }

    const data: any = {};
    if (dto.rating !== undefined) {
      const r = Number(dto.rating);
      if (r < 1 || r > 5) throw new BadRequestException('Rating must be between 1 and 5');
      data.rating = r;
    }
    if (dto.comment !== undefined) {
      data.comment = dto.comment ? dto.comment.trim() : null;
    }
    // Any customer edit returns review to PENDING for moderation re-check
    data.status = 'PENDING';

    return this.prisma.review.update({
      where: { id },
      data,
    });
  }

  async getProductReviewsPublic(productId: string) {
    const reviews = await this.prisma.review.findMany({
      where: {
        productId,
        type: 'PRODUCT',
        status: 'APPROVED', // Only moderated and approved reviews are public
      },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        rating: true,
        comment: true,
        userName: true,
        createdAt: true,
      },
    });

    const total = reviews.length;
    const avg = total > 0 
      ? Number((reviews.reduce((sum, r) => sum + r.rating, 0) / total).toFixed(1))
      : 5.0;

    return {
      productId,
      averageRating: avg,
      totalReviews: total,
      reviews,
    };
  }

  async getWebsiteReviewsPublic() {
    return this.prisma.review.findMany({
      where: {
        type: 'WEBSITE',
        status: 'APPROVED',
      },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        rating: true,
        comment: true,
        userName: true,
        createdAt: true,
      },
    });
  }

  async getCustomerReviews(user: any) {
    const userId = user.phone || user.id;
    return this.prisma.review.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getAdminReviews(query?: { type?: string; status?: string; flagged?: string }) {
    const where: any = {};
    if (query?.type && query.type !== 'ALL') where.type = query.type;
    if (query?.status && query.status !== 'ALL') where.status = query.status;
    if (query?.flagged !== undefined) where.flagged = query.flagged === 'true';

    return this.prisma.review.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async moderateReview(id: string, staffUser: any, status: 'APPROVED' | 'HIDDEN', flagged?: boolean) {
    const review = await this.prisma.review.findUnique({ where: { id } });
    if (!review) throw new NotFoundException(`Review #${id} not found`);

    return this.prisma.review.update({
      where: { id },
      data: {
        status,
        flagged: flagged !== undefined ? flagged : review.flagged,
        moderatedById: staffUser?.id || staffUser?.phone || 'staff',
        moderatedAt: new Date(),
      },
    });
  }
}
