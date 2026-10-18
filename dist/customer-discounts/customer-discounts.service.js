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
exports.CustomerDiscountsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CustomerDiscountsService = class CustomerDiscountsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createDiscount(staffUser, dto) {
        if (!dto.userId) {
            throw new common_1.BadRequestException('Target customer phone or ID is required');
        }
        const val = Number(dto.discountValue);
        if (!val || val <= 0) {
            throw new common_1.BadRequestException('Discount value must be greater than zero');
        }
        if (dto.discountType === 'PERCENTAGE' && val > 100) {
            throw new common_1.BadRequestException('Percentage discount cannot exceed 100%');
        }
        const exp = new Date(dto.expiresAt);
        if (isNaN(exp.getTime()) || exp.getTime() <= Date.now()) {
            throw new common_1.BadRequestException('Expiry date must be in the future');
        }
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
    async getCustomerDiscounts(user) {
        const userId = user.phone || user.id;
        const now = new Date();
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
    async getAdminDiscounts(query) {
        const where = {};
        if (query?.status && query.status !== 'ALL')
            where.status = query.status;
        if (query?.userId)
            where.userId = query.userId;
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
    async revokeDiscount(id, staffUser) {
        const discount = await this.prisma.customerDiscount.findUnique({ where: { id } });
        if (!discount)
            throw new common_1.NotFoundException(`Reward discount #${id} not found`);
        if (discount.status === 'REDEEMED') {
            throw new common_1.BadRequestException('Cannot revoke a discount that has already been redeemed');
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
    async validateDiscount(code, user, cartSubtotal) {
        const userId = user.phone || user.id;
        const discount = await this.prisma.customerDiscount.findUnique({
            where: { code: code.trim().toUpperCase() },
        });
        if (!discount) {
            throw new common_1.NotFoundException('Invalid discount or reward code');
        }
        if (discount.userId !== userId && discount.userId !== user.phone && discount.userId !== user.id) {
            throw new common_1.ForbiddenException('This reward discount is exclusive to another customer account');
        }
        if (discount.status === 'REVOKED') {
            throw new common_1.BadRequestException('This discount has been revoked');
        }
        if (discount.status === 'REDEEMED' || discount.usedCount >= discount.maxUses) {
            throw new common_1.BadRequestException('This discount has already reached its maximum usage limit');
        }
        if (new Date(discount.expiresAt).getTime() <= Date.now()) {
            await this.prisma.customerDiscount.update({
                where: { id: discount.id },
                data: { status: 'EXPIRED' },
            });
            throw new common_1.BadRequestException('This reward discount has expired');
        }
        if (discount.minOrderAmount > 0 && cartSubtotal < discount.minOrderAmount) {
            throw new common_1.BadRequestException(`Minimum cart order amount of ₹${discount.minOrderAmount} required to use this reward (current: ₹${cartSubtotal})`);
        }
        let calculatedDeduction = 0;
        if (discount.discountType === 'PERCENTAGE') {
            calculatedDeduction = Number(((cartSubtotal * discount.discountValue) / 100).toFixed(2));
        }
        else {
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
};
exports.CustomerDiscountsService = CustomerDiscountsService;
exports.CustomerDiscountsService = CustomerDiscountsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CustomerDiscountsService);
//# sourceMappingURL=customer-discounts.service.js.map