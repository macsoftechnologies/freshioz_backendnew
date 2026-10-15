import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';

@Injectable()
export class UnitsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(status?: string) {
    const where: any = {};
    if (status) {
      where.status = status;
    }
    return this.prisma.unit.findMany({
      where,
      orderBy: [{ isBulk: 'asc' }, { createdAt: 'asc' }],
    });
  }

  async findOne(id: string) {
    const unit = await this.prisma.unit.findUnique({
      where: { id },
    });
    if (!unit) {
      throw new NotFoundException(`Unit #${id} not found`);
    }
    return unit;
  }

  async create(dto: CreateUnitDto) {
    const rawName = dto.name.trim();
    const id = dto.id?.trim() || `UNIT_${rawName.toUpperCase().replace(/[^A-Z0-9]/g, '_')}`;

    const existing = await this.prisma.unit.findUnique({
      where: { id },
    });
    if (existing) {
      throw new ConflictException(`Unit with code "${id}" already exists`);
    }

    return this.prisma.unit.create({
      data: {
        id,
        name: rawName,
        label: dto.label?.trim() || rawName,
        isBulk: dto.isBulk ?? false,
        description: dto.description || null,
        status: dto.status || 'ACTIVE',
      },
    });
  }

  async update(id: string, dto: UpdateUnitDto) {
    const existing = await this.prisma.unit.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException(`Unit #${id} not found`);
    }

    const data: any = {};
    if (dto.name !== undefined) data.name = dto.name.trim();
    if (dto.label !== undefined) data.label = dto.label.trim();
    if (dto.isBulk !== undefined) data.isBulk = dto.isBulk;
    if (dto.description !== undefined) data.description = dto.description;
    if (dto.status !== undefined) data.status = dto.status;

    return this.prisma.unit.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    const existing = await this.prisma.unit.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException(`Unit #${id} not found`);
    }

    // Try hard delete; if referenced, soft-deactivate to INACTIVE
    try {
      return await this.prisma.unit.delete({
        where: { id },
      });
    } catch (e) {
      return this.prisma.unit.update({
        where: { id },
        data: { status: 'INACTIVE' },
      });
    }
  }
}
