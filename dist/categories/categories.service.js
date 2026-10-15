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
exports.CategoriesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CategoriesService = class CategoriesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(status) {
        const where = {};
        if (status) {
            where.status = status;
        }
        return this.prisma.category.findMany({
            where,
            include: {
                _count: {
                    select: { products: true },
                },
            },
            orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
        });
    }
    async findOne(idOrSlug) {
        const category = await this.prisma.category.findFirst({
            where: {
                OR: [{ id: idOrSlug }, { slug: idOrSlug }],
            },
            include: {
                products: {
                    where: { status: { not: 'ARCHIVED' } },
                },
            },
        });
        if (!category) {
            throw new common_1.NotFoundException(`Category "${idOrSlug}" not found`);
        }
        return category;
    }
    async create(dto) {
        const rawName = dto.name.trim();
        const slug = dto.slug
            ? dto.slug.trim().toLowerCase()
            : rawName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        const id = dto.id?.trim() || `CAT_${slug.toUpperCase().replace(/-/g, '_')}`;
        const existingSlug = await this.prisma.category.findFirst({
            where: {
                OR: [{ id }, { slug }],
            },
        });
        if (existingSlug) {
            throw new common_1.ConflictException(`Category with ID "${id}" or slug "${slug}" already exists`);
        }
        return this.prisma.category.create({
            data: {
                id,
                name: rawName,
                slug,
                icon: dto.icon || '🌱',
                description: dto.description || null,
                status: dto.status || 'ACTIVE',
                sortOrder: dto.sortOrder ?? 0,
            },
        });
    }
    async update(id, dto) {
        const existing = await this.prisma.category.findUnique({
            where: { id },
        });
        if (!existing) {
            throw new common_1.NotFoundException(`Category #${id} not found`);
        }
        const data = {};
        if (dto.name !== undefined)
            data.name = dto.name.trim();
        if (dto.slug !== undefined)
            data.slug = dto.slug.trim().toLowerCase();
        if (dto.icon !== undefined)
            data.icon = dto.icon;
        if (dto.description !== undefined)
            data.description = dto.description;
        if (dto.status !== undefined)
            data.status = dto.status;
        if (dto.sortOrder !== undefined)
            data.sortOrder = dto.sortOrder;
        return this.prisma.category.update({
            where: { id },
            data,
        });
    }
    async remove(id) {
        const existing = await this.prisma.category.findUnique({
            where: { id },
            include: {
                _count: {
                    select: { products: true },
                },
            },
        });
        if (!existing) {
            throw new common_1.NotFoundException(`Category #${id} not found`);
        }
        if (existing._count.products > 0) {
            return this.prisma.category.update({
                where: { id },
                data: { status: 'INACTIVE' },
            });
        }
        return this.prisma.category.delete({
            where: { id },
        });
    }
};
exports.CategoriesService = CategoriesService;
exports.CategoriesService = CategoriesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CategoriesService);
//# sourceMappingURL=categories.service.js.map