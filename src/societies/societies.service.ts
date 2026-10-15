import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SocietiesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const list = await this.prisma.society.findMany({
      include: { warehouse: true },
      orderBy: { id: 'asc' },
    });
    // Sanitize banking data and secretary personal phone for public queries
    return list.map(s => ({
      ...s,
      accountNumber: s.accountNumber ? `••••${s.accountNumber.slice(-4)}` : null,
      ifscCode: s.ifscCode ? `••••${s.ifscCode.slice(-4)}` : null,
      secretaryPhone: s.secretaryPhone ? `••••${s.secretaryPhone.slice(-4)}` : null,
    }));
  }

  async findOne(idOrUuid: string) {
    const society = await this.prisma.society.findFirst({
      where: {
        OR: [{ id: idOrUuid }, { uuid: idOrUuid }],
      },
      include: { warehouse: true },
    });
    if (!society) throw new NotFoundException(`Society #${idOrUuid} not found`);
    return {
      ...society,
      accountNumber: society.accountNumber ? `••••${society.accountNumber.slice(-4)}` : null,
      ifscCode: society.ifscCode ? `••••${society.ifscCode.slice(-4)}` : null,
      secretaryPhone: society.secretaryPhone ? `••••${society.secretaryPhone.slice(-4)}` : null,
    };
  }

  async requestPayout(societyId: string, amount: number) {
    return this.prisma.$transaction(async (tx) => {
      const society = await tx.society.findUnique({ where: { id: societyId } });
      if (!society) throw new NotFoundException(`Society #${societyId} not found`);
      const numAmt = parseFloat(amount as any) || 0;
      if (numAmt <= 0) throw new BadRequestException('Withdrawal amount must be greater than zero');
      if (society.balanceEarned < numAmt) {
        throw new BadRequestException(`Requested amount ₹${numAmt} exceeds earned balance ₹${society.balanceEarned}`);
      }

      const payout = await tx.societyPayout.create({
        data: {
          id: `WD-${Date.now()}`,
          societyId,
          amount: numAmt,
          status: 'PENDING_APPROVAL',
          transactionRef: `REQ-${Date.now().toString().slice(-6)}`,
          paymentMethod: 'NEFT_IMPS',
          notes: `Partner portal withdrawal request for ₹${numAmt}`,
        },
      });

      await tx.society.update({
        where: { id: societyId },
        data: { balanceEarned: { decrement: numAmt } },
      });

      return payout;
    });
  }

  async create(body: any) {
    const {
      id,
      name,
      type,
      address,
      imageUrl,
      lat,
      lng,
      warehouseId,
      secretaryName,
      secretaryPhone,
      totalFloors,
      totalUnits,
      deliveryMode,
      status,
      commissionType,
      commissionValue,
      bankName,
      accountHolder,
      accountNumber,
      ifscCode,
    } = body;

    // Check duplicate society name
    const existing = await this.prisma.society.findFirst({
      where: { name: { equals: name.trim(), mode: 'insensitive' } },
    });
    if (existing) {
      throw new ConflictException(`Society or apartment "${name}" is already registered`);
    }

    return this.prisma.society.create({
      data: {
        id: id || `FRZ_SOC_${Date.now()}`,
        name: name.trim(),
        type: type || 'APARTMENT',
        address,
        imageUrl: imageUrl || null,
        lat: lat ? parseFloat(lat) : null,
        lng: lng ? parseFloat(lng) : null,
        warehouseId: warehouseId || null,
        secretaryName: secretaryName || null,
        secretaryPhone: secretaryPhone || null,
        totalFloors: totalFloors ? parseInt(totalFloors) : 1,
        totalUnits: totalUnits ? parseInt(totalUnits) : 10,
        deliveryMode: deliveryMode || 'SOCIETY_DESK',
        status: status || 'APPROVED',
        commissionType: commissionType || 'PERCENTAGE',
        commissionValue: commissionValue ? parseFloat(commissionValue) : 3.5,
        bankName: bankName || null,
        accountHolder: accountHolder || null,
        accountNumber: accountNumber || null,
        ifscCode: ifscCode || null,
      },
      include: { warehouse: true },
    });
  }

  async update(idOrUuid: string, data: any) {
    const existing = await this.prisma.society.findFirst({
      where: {
        OR: [{ id: idOrUuid }, { uuid: idOrUuid }],
      },
    });
    if (!existing) throw new NotFoundException('Society not found');

    return this.prisma.society.update({
      where: { id: existing.id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.type && { type: data.type }),
        ...(data.address && { address: data.address }),
        ...(data.status && { status: data.status }),
        ...(data.warehouseId !== undefined && { warehouseId: data.warehouseId }),
        ...(data.commissionValue !== undefined && { commissionValue: parseFloat(data.commissionValue) }),
        ...(data.commissionType && { commissionType: data.commissionType }),
        ...(data.secretaryName !== undefined && { secretaryName: data.secretaryName }),
        ...(data.secretaryPhone !== undefined && { secretaryPhone: data.secretaryPhone }),
        ...(data.bankName !== undefined && { bankName: data.bankName }),
        ...(data.accountHolder !== undefined && { accountHolder: data.accountHolder }),
        ...(data.accountNumber !== undefined && { accountNumber: data.accountNumber }),
        ...(data.ifscCode !== undefined && { ifscCode: data.ifscCode }),
      },
      include: { warehouse: true },
    });
  }
}
