import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(status?: string) {
    const where: any = {};
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

  async findOne(idOrSlug: string) {
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
      throw new NotFoundException(`Category "${idOrSlug}" not found`);
    }
    return category;
  }

  async create(dto: CreateCategoryDto) {
    const rawName = dto.name.trim();
    const slug = dto.slug
      ? dto.slug.trim().toLowerCase()
      : rawName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const id = dto.id?.trim() || `CAT_${slug.toUpperCase().replace(/-/g, '_')}`;

    // Verify slug uniqueness
    const existingSlug = await this.prisma.category.findFirst({
      where: {
        OR: [{ id }, { slug }],
      },
    });
    if (existingSlug) {
      throw new ConflictException(`Category with ID "${id}" or slug "${slug}" already exists`);
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

  async update(id: string, dto: UpdateCategoryDto) {
    const existing = await this.prisma.category.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException(`Category #${id} not found`);
    }

    const data: any = {};
    if (dto.name !== undefined) data.name = dto.name.trim();
    if (dto.slug !== undefined) data.slug = dto.slug.trim().toLowerCase();
    if (dto.icon !== undefined) data.icon = dto.icon;
    if (dto.description !== undefined) data.description = dto.description;
    if (dto.status !== undefined) data.status = dto.status;
    if (dto.sortOrder !== undefined) data.sortOrder = dto.sortOrder;

    return this.prisma.category.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    const existing = await this.prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    if (!existing) {
      throw new NotFoundException(`Category #${id} not found`);
    }

    // If products are linked to this category, soft-deactivate instead of breaking foreign keys
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
}
