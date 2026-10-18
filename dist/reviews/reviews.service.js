"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ReviewsService = class ReviewsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createReview(user, dto) {
        if (!user || (!user.id && !user.phone)) {
            throw new common_1.ForbiddenException('Authentication required to submit a review');
        }
        const rating = Number(dto.rating);
        if (!rating || rating < 1 || rating > 5) {
            throw new common_1.BadRequestException('Rating is required and must be between 1 and 5 stars');
        }
        const userId = user.phone || user.id;
        const userName = user.name || 'Resident';
        const userPhone = user.phone || user.id;
        if (dto.type === 'PRODUCT') {
            if (!dto.orderId) {
                throw new common_1.BadRequestException('Order reference is required for a product review');
            }
            if (!dto.productId) {
                throw new common_1.BadRequestException('Product reference is required for a product review');
            }
            const order = await this.prisma.order.findFirst({
                where: {
                    OR: [{ id: dto.orderId }, { uuid: dto.orderId }],
                },
                include: { items: true },
            });
            if (!order) {
                throw new common_1.NotFoundException(`Order #${dto.orderId} not found`);
            }
            if (order.userPhone !== user.phone && order.userId !== user.id) {
                throw new common_1.ForbiddenException('You can only review products from your own orders');
            }
            if (order.status !== 'DELIVERED') {
                throw new common_1.BadRequestException('Product reviews are only available after the order has been delivered');
            }
            const item = order.items.find(i => i.productId === dto.productId);
            if (!item) {
                throw new common_1.BadRequestException('This product was not part of the specified order');
            }
            const existing = await this.prisma.review.findFirst({
                where: {
                    type: 'PRODUCT',
                    orderId: order.id,
                    productId: dto.productId,
                    userId,
                },
            });
            if (existing) {
                throw new common_1.BadRequestException('You have already reviewed this product for this order. You can edit your existing review.');
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
                    status: 'PENDING',
                },
            });
        }
        if (dto.type === 'DELIVERY') {
            if (!dto.orderId) {
                throw new common_1.BadRequestException('Order reference is required for a delivery review');
            }
            const order = await this.prisma.order.findFirst({
                where: {
                    OR: [{ id: dto.orderId }, { uuid: dto.orderId }],
                },
            });
            if (!order) {
                throw new common_1.NotFoundException(`Order #${dto.orderId} not found`);
            }
            if (order.userPhone !== user.phone && order.userId !== user.id) {
                throw new common_1.ForbiddenException('You can only review delivery for your own orders');
            }
            if (order.status !== 'DELIVERED') {
                throw new common_1.BadRequestException('Delivery reviews are only available after the order has been delivered');
            }
            const existing = await this.prisma.review.findFirst({
                where: {
                    type: 'DELIVERY',
                    orderId: order.id,
                    userId,
                },
            });
            if (existing) {
                throw new common_1.BadRequestException('You have already submitted a delivery review for this order.');
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
        throw new common_1.BadRequestException(`Invalid review type: ${dto.type}`);
    }
    async updateReview(id, user, dto) {
        const review = await this.prisma.review.findUnique({
            where: { id },
        });
        if (!review) {
            throw new common_1.NotFoundException(`Review #${id} not found`);
        }
        const userId = user.phone || user.id;
        if (review.userId !== userId) {
            throw new common_1.ForbiddenException('You can only edit your own reviews');
        }
        const data = {};
        if (dto.rating !== undefined) {
            const r = Number(dto.rating);
            if (r < 1 || r > 5)
                throw new common_1.BadRequestException('Rating must be between 1 and 5');
            data.rating = r;
        }
        if (dto.comment !== undefined) {
            data.comment = dto.comment ? dto.comment.trim() : null;
        }
        data.status = 'PENDING';
        return this.prisma.review.update({
            where: { id },
            data,
        });
    }
    async getProductReviewsPublic(productId) {
        const reviews = await this.prisma.review.findMany({
            where: {
                productId,
                type: 'PRODUCT',
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
    async getCustomerReviews(user) {
        const userId = user.phone || user.id;
        return this.prisma.review.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async getAdminReviews(query) {
        const where = {};
        if (query?.type && query.type !== 'ALL')
            where.type = query.type;
        if (query?.status && query.status !== 'ALL')
            where.status = query.status;
        if (query?.flagged !== undefined)
            where.flagged = query.flagged === 'true';
        return this.prisma.review.findMany({
            where,
            orderBy: { createdAt: 'desc' },
        });
    }
    async moderateReview(id, staffUser, status, flagged) {
        const review = await this.prisma.review.findUnique({ where: { id } });
        if (!review)
            throw new common_1.NotFoundException(`Review #${id} not found`);
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
};
exports.ReviewsService = ReviewsService;
exports.ReviewsService = ReviewsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReviewsService);
//# sourceMappingURL=reviews.service.js.map