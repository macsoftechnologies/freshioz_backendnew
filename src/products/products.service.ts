import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.product.findMany({
      include: { category: true },
      orderBy: { id: 'asc' },
    });
  }

  async findOne(idOrUuid: string) {
    const product = await this.prisma.product.findFirst({
      where: {
        OR: [{ id: idOrUuid }, { uuid: idOrUuid }],
      },
      include: { category: true },
    });
    if (!product) throw new NotFoundException(`Product #${idOrUuid} not found`);
    return product;
  }

  async create(body: any) {
    const {
      id,
      name,
      kannadaName,
      categoryId,
      retailUnit,
      retailPrice,
      retailMarketPrice,
      bulkMinQty,
      bulkDiscountPercent,
      origin,
      shelfLife,
      desc,
      image,
      badge,
      tags,
      gstPercent,
    } = body;

    // Check duplicate product name
    const existing = await this.prisma.product.findFirst({
      where: { name: { equals: name.trim(), mode: 'insensitive' } },
    });
    if (existing) {
      throw new ConflictException(`Produce item "${name}" is already cataloged`);
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

  async update(idOrUuid: string, data: any) {
    const existing = await this.prisma.product.findFirst({
      where: {
        OR: [{ id: idOrUuid }, { uuid: idOrUuid }],
      },
    });
    if (!existing) throw new NotFoundException('Product not found');

    return this.prisma.product.update({
      where: { id: existing.id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.kannadaName !== undefined && { kannadaName: data.kannadaName }),
        ...(data.categoryId && { categoryId: data.categoryId }),
        ...(data.retailUnit && { retailUnit: data.retailUnit }),
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

  async delete(idOrUuid: string) {
    const existing = await this.prisma.product.findFirst({
      where: {
        OR: [{ id: idOrUuid }, { uuid: idOrUuid }],
      },
    });
    if (!existing) throw new NotFoundException('Product not found');

    return this.prisma.product.delete({
      where: { id: existing.id },
    });
  }
}

