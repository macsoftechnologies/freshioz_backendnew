import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { formatDateIST, formatTimeIST } from '../common/date-utils';

@Injectable()
export class VendorsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const vendors = await this.prisma.vendor.findMany({
      orderBy: { createdAt: 'asc' },
    });

    return vendors.map(v => ({
      ...v,
      formattedCreatedAt: formatDateIST(v.createdAt),
      formattedTime: formatTimeIST(v.createdAt),
    }));
  }

  async findOne(idOrUuid: string) {
    const vendor = await this.prisma.vendor.findFirst({
      where: {
        OR: [{ id: idOrUuid }, { uuid: idOrUuid }],
      },
    });
    if (!vendor) throw new NotFoundException(`Vendor #${idOrUuid} not found`);
    return {
      ...vendor,
      formattedCreatedAt: formatDateIST(vendor.createdAt),
      formattedTime: formatTimeIST(vendor.createdAt),
    };
  }

  async create(body: any) {
    const { id, name, phone, category, mandiLocation, lat, lng, bankName, accountHolder, accountNumber, ifscCode, upiId, status } = body;

    // Check duplicate vendor phone
    const cleanPhone = phone ? phone.trim() : '';
    if (cleanPhone) {
      const existing = await this.prisma.vendor.findFirst({
        where: { phone: cleanPhone },
      });
      if (existing) {
        throw new ConflictException(`Vendor with phone number "${cleanPhone}" is already registered`);
      }
    }

    const newVendor = await this.prisma.vendor.create({
      data: {
        id: id || `FRZ_VND_${Date.now()}`,
        name: name.trim(),
        phone: cleanPhone,
        category: category || 'COMMISSION_AGENT',
        mandiLocation: mandiLocation || 'Kolar APMC Mandi',
        lat: lat ? parseFloat(lat) : null,
        lng: lng ? parseFloat(lng) : null,
        bankName: bankName || null,
        accountHolder: accountHolder || null,
        accountNumber: accountNumber || null,
        ifscCode: ifscCode || null,
        upiId: upiId || null,
        status: status || 'ACTIVE',
      },
    });

    return {
      ...newVendor,
      formattedCreatedAt: formatDateIST(newVendor.createdAt),
      formattedTime: formatTimeIST(newVendor.createdAt),
    };
  }

  async update(idOrUuid: string, data: any) {
    const existing = await this.prisma.vendor.findFirst({
      where: {
        OR: [{ id: idOrUuid }, { uuid: idOrUuid }],
      },
    });
    if (!existing) throw new NotFoundException('Vendor not found');

    const updated = await this.prisma.vendor.update({
      where: { id: existing.id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.phone && { phone: data.phone }),
        ...(data.category && { category: data.category }),
        ...(data.mandiLocation && { mandiLocation: data.mandiLocation }),
        ...(data.lat !== undefined && { lat: parseFloat(data.lat) }),
        ...(data.lng !== undefined && { lng: parseFloat(data.lng) }),
        ...(data.bankName !== undefined && { bankName: data.bankName }),
        ...(data.accountHolder !== undefined && { accountHolder: data.accountHolder }),
        ...(data.accountNumber !== undefined && { accountNumber: data.accountNumber }),
        ...(data.ifscCode !== undefined && { ifscCode: data.ifscCode }),
        ...(data.upiId !== undefined && { upiId: data.upiId }),
        ...(data.status && { status: data.status }),
      },
    });

    return {
      ...updated,
      formattedCreatedAt: formatDateIST(updated.createdAt),
      formattedTime: formatTimeIST(updated.createdAt),
    };
  }
}
