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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ProductsService = class ProductsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        return this.prisma.product.findMany({
            include: { category: true },
            orderBy: { id: 'asc' },
        });
    }
    async findOne(idOrUuid) {
        const product = await this.prisma.product.findFirst({
            where: {
                OR: [{ id: idOrUuid }, { uuid: idOrUuid }],
            },
            include: { category: true },
        });
        if (!product)
            throw new common_1.NotFoundException(`Product #${idOrUuid} not found`);
        return product;
    }
    async create(body) {
        const { id, name, kannadaName, categoryId, retailUnit, retailPrice, retailMarketPrice, bulkMinQty, bulkDiscountPercent, origin, shelfLife, desc, image, badge, tags, gstPercent, } = body;
        const existing = await this.prisma.product.findFirst({
            where: { name: { equals: name.trim(), mode: 'insensitive' } },
        });
        if (existing) {
            throw new common_1.ConflictException(`Produce item "${name}" is already cataloged`);
        }
        return this.prisma.product.create({
            data: {
                id: id || `FRZ_PRD_${Date.now()}`,
                name: name.trim(),
                kannadaName,
                categoryId: categoryId || 'VEGETABLES',
                retailUnit: retailUnit || '1 kg',
                retailPrice: parseFloat(retailPrice) || 40.0,
                retailMarketPrice: parseFloat(retailMarketPrice) || 55.0,
                bulkMinQty: parseFloat(bulkMinQty) || 0,
                bulkDiscountPercent: parseFloat(bulkDiscountPercent) || 0,
                origin: origin || 'APMC Mandi',
                shelfLife: shelfLife || '3-5 Days',
                desc: desc || null,
                image: image || '',
                badge: badge || 'Harvested Today at Dawn',
                tags: Array.isArray(tags) ? tags : [],
                gstPercent: parseFloat(gstPercent) || 0,
                status: 'ACTIVE',
            },
            include: { category: true },
        });
    }
    async update(idOrUuid, data) {
        const existing = await this.prisma.product.findFirst({
            where: {
                OR: [{ id: idOrUuid }, { uuid: idOrUuid }],
            },
        });
        if (!existing)
            throw new common_1.NotFoundException('Product not found');
        const catId = data.categoryId || data.category;
        if (catId) {
            const existingCat = await this.prisma.category.findUnique({ where: { id: catId } });
            if (!existingCat) {
                await this.prisma.category.upsert({
                    where: { id: catId },
                    update: {},
                    create: {
                        id: catId,
                        name: catId.replace(/_/g, ' '),
                        slug: catId.toLowerCase().replace(/_/g, '-'),
                        icon: '🥦',
                    },
                });
            }
        }
        const unit = data.retailUnit || data.defaultUnit;
        return this.prisma.product.update({
            where: { id: existing.id },
            data: {
                ...(data.name && { name: data.name }),
                ...(data.kannadaName !== undefined && { kannadaName: data.kannadaName }),
                ...(catId && { categoryId: catId }),
                ...(unit && { retailUnit: unit }),
                ...(data.retailPrice !== undefined && { retailPrice: parseFloat(data.retailPrice) }),
                ...(data.retailMarketPrice !== undefined && { retailMarketPrice: parseFloat(data.retailMarketPrice) }),
                ...(data.bulkMinQty !== undefined && { bulkMinQty: parseFloat(data.bulkMinQty) }),
                ...(data.bulkDiscountPercent !== undefined && { bulkDiscountPercent: parseFloat(data.bulkDiscountPercent) }),
                ...(data.origin !== undefined && { origin: data.origin }),
                ...(data.shelfLife !== undefined && { shelfLife: data.shelfLife }),
                ...(data.desc !== undefined && { desc: data.desc }),
                ...(data.image !== undefined && { image: data.image }),
                ...(data.badge !== undefined && { badge: data.badge }),
                ...(data.tags !== undefined && { tags: Array.isArray(data.tags) ? data.tags : [] }),
                ...(data.gstPercent !== undefined && { gstPercent: parseFloat(data.gstPercent) }),
                ...(data.status && { status: data.status }),
            },
            include: { category: true },
        });
    }
    async delete(idOrUuid) {
        const existing = await this.prisma.product.findFirst({
            where: {
                OR: [{ id: idOrUuid }, { uuid: idOrUuid }],
            },
            include: {
                orderItems: true,
            },
        });
        if (!existing)
            throw new common_1.NotFoundException('Product not found');
        if (existing.orderItems && existing.orderItems.length > 0) {
            return this.prisma.product.update({
                where: { id: existing.id },
                data: { status: 'ARCHIVED' },
            });
        }
        return this.prisma.$transaction(async (tx) => {
            await tx.dailyPriceHistory.deleteMany({ where: { productId: existing.id } });
            await tx.warehouseInventory.deleteMany({ where: { productId: existing.id } });
            return tx.product.delete({
                where: { id: existing.id },
            });
        });
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProductsService);
//# sourceMappingURL=products.service.js.map