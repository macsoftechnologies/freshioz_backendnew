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
      contactPerson: v.accountHolder || null,
      bankDetails: {
        bankName: v.bankName || null,
        accountHolder: v.accountHolder || null,
        accountNumber: v.accountNumber || null,
        ifscCode: v.ifscCode || null,
        upiId: v.upiId || null,
      },
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
      contactPerson: vendor.accountHolder || null,
      bankDetails: {
        bankName: vendor.bankName || null,
        accountHolder: vendor.accountHolder || null,
        accountNumber: vendor.accountNumber || null,
        ifscCode: vendor.ifscCode || null,
        upiId: vendor.upiId || null,
      },
      formattedCreatedAt: formatDateIST(vendor.createdAt),
      formattedTime: formatTimeIST(vendor.createdAt),
    };
  }

  async create(body: any) {
    const { id, name, phone, category, mandiLocation, lat, lng, status } = body;
    const bankName = body.bankName || body.bankDetails?.bankName || null;
    const accountHolder = body.accountHolder || body.contactPerson || body.bankDetails?.accountHolder || null;
    const accountNumber = body.accountNumber || body.bankDetails?.accountNumber || null;
    const ifscCode = body.ifscCode || body.bankDetails?.ifscCode || null;
    const upiId = body.upiId || body.bankDetails?.upiId || null;

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
      contactPerson: newVendor.accountHolder || null,
      bankDetails: {
        bankName: newVendor.bankName || null,
        accountHolder: newVendor.accountHolder || null,
        accountNumber: newVendor.accountNumber || null,
        ifscCode: newVendor.ifscCode || null,
        upiId: newVendor.upiId || null,
      },
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

    const resolvedBankName = data.bankName !== undefined ? data.bankName : data.bankDetails?.bankName;
    const resolvedAccountHolder = data.accountHolder !== undefined ? data.accountHolder : (data.contactPerson !== undefined ? data.contactPerson : data.bankDetails?.accountHolder);
    const resolvedAccountNumber = data.accountNumber !== undefined ? data.accountNumber : data.bankDetails?.accountNumber;
    const resolvedIfscCode = data.ifscCode !== undefined ? data.ifscCode : data.bankDetails?.ifscCode;
    const resolvedUpiId = data.upiId !== undefined ? data.upiId : data.bankDetails?.upiId;

    const updated = await this.prisma.vendor.update({
      where: { id: existing.id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.phone && { phone: data.phone }),
        ...(data.category && { category: data.category }),
        ...(data.mandiLocation && { mandiLocation: data.mandiLocation }),
        ...(data.lat !== undefined && { lat: parseFloat(data.lat) }),
        ...(data.lng !== undefined && { lng: parseFloat(data.lng) }),
        ...(resolvedBankName !== undefined && { bankName: resolvedBankName }),
        ...(resolvedAccountHolder !== undefined && { accountHolder: resolvedAccountHolder }),
        ...(resolvedAccountNumber !== undefined && { accountNumber: resolvedAccountNumber }),
        ...(resolvedIfscCode !== undefined && { ifscCode: resolvedIfscCode }),
        ...(resolvedUpiId !== undefined && { upiId: resolvedUpiId }),
        ...(data.status && { status: data.status }),
      },
    });

    return {
      ...updated,
      contactPerson: updated.accountHolder || null,
      bankDetails: {
        bankName: updated.bankName || null,
        accountHolder: updated.accountHolder || null,
        accountNumber: updated.accountNumber || null,
        ifscCode: updated.ifscCode || null,
        upiId: updated.upiId || null,
      },
      formattedCreatedAt: formatDateIST(updated.createdAt),
      formattedTime: formatTimeIST(updated.createdAt),
    };
  }
}
