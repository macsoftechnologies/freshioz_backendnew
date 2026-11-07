import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as fs from 'fs';
import * as path from 'path';

const SLOTS_FILE = path.join(process.cwd(), 'uploads', 'warehouse-slots.json');

export function readWarehouseSlotsConfig(): Record<string, any[]> {
  try {
    if (fs.existsSync(SLOTS_FILE)) {
      return JSON.parse(fs.readFileSync(SLOTS_FILE, 'utf8'));
    }
  } catch (e) {}
  return {};
}

export function writeWarehouseSlotsConfig(config: Record<string, any[]>) {
  try {
    const dir = path.dirname(SLOTS_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(SLOTS_FILE, JSON.stringify(config, null, 2), 'utf8');
  } catch (e) {}
}

export function getDefaultWarehouseSlots() {
  return [
    {
      id: 'SLOT_DAWN',
      label: 'Early Dawn Drop',
      startTime: '05:30',
      endTime: '07:00',
      timeWindow: '05:30 AM – 07:00 AM',
      desc: 'Security desk / gate drop before morning commute',
      enabled: true,
    },
    {
      id: 'SLOT_MORNING',
      label: 'Morning Fresh Slot',
      startTime: '07:00',
      endTime: '08:30',
      timeWindow: '07:00 AM – 08:30 AM',
      desc: 'Doorstep delivery fresh from dawn harvest',
      enabled: true,
    },
    {
      id: 'SLOT_EVENING',
      label: 'Evening Fresh Run',
      startTime: '17:30',
      endTime: '19:30',
      timeWindow: '05:30 PM – 07:30 PM',
      desc: 'Fresh batch delivery for evening dinner prep',
      enabled: true,
    },
  ];
}

@Injectable()
export class WarehousesService {
  constructor(private readonly prisma: PrismaService) {}

  resolveWarehouseSlots(warehouse: any) {
    const config = readWarehouseSlotsConfig();
    const customSlots = (warehouse && (config[warehouse.id] || config[warehouse.code])) || warehouse?.slots;
    if (customSlots) {
      try {
        const parsed = typeof customSlots === 'string' ? JSON.parse(customSlots) : customSlots;
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }

    return getDefaultWarehouseSlots();
  }

  async findAll(isStaff = false) {
    const list = await this.prisma.warehouse.findMany({
      orderBy: { createdAt: 'asc' },
    });
    return list.map(w => ({
      ...w,
      slots: this.resolveWarehouseSlots(w),
      managerPhone: (isStaff && w.managerPhone) ? w.managerPhone : (w.managerPhone ? '••••' + w.managerPhone.slice(-4) : null),
    }));
  }

  async findOne(idOrCode: string, isStaff = false) {
    const warehouse = await this.prisma.warehouse.findFirst({
      where: {
        OR: [{ id: idOrCode }, { uuid: idOrCode }, { code: idOrCode }],
      },
      include: isStaff ? { societies: true, inventory: true } : { societies: true },
    });
    if (!warehouse) throw new NotFoundException(`Warehouse #${idOrCode} not found`);

    const sanitizedSocieties = (warehouse.societies || []).map((s) => ({
      id: s.id,
      uuid: s.uuid,
      name: s.name,
      type: s.type,
      address: s.address,
      imageUrl: s.imageUrl,
      status: s.status,
      deliveryMode: s.deliveryMode,
      totalUnits: s.totalUnits,
      totalFloors: s.totalFloors,
      secretaryName: isStaff ? s.secretaryName : (s.secretaryName ? `${s.secretaryName.charAt(0)}••••` : null),
      secretaryPhone: (isStaff && s.secretaryPhone) ? s.secretaryPhone : (s.secretaryPhone ? `••••${s.secretaryPhone.slice(-4)}` : null),
      accountNumber: (isStaff && s.accountNumber) ? s.accountNumber : (s.accountNumber ? `••••${s.accountNumber.slice(-4)}` : null),
      ifscCode: (isStaff && s.ifscCode) ? s.ifscCode : (s.ifscCode ? `••••${s.ifscCode.slice(-4)}` : null),
      accountHolder: isStaff ? s.accountHolder : null,
      bankName: isStaff ? s.bankName : null,
    }));

    return {
      ...warehouse,
      slots: this.resolveWarehouseSlots(warehouse),
      societies: sanitizedSocieties,
      managerPhone: (isStaff && warehouse.managerPhone)
        ? warehouse.managerPhone
        : (warehouse.managerPhone ? `••••${warehouse.managerPhone.slice(-4)}` : null),
      ...(isStaff ? {} : { capacityTons: undefined, inventory: undefined }),
    };
  }

  async create(body: any) {
    const { id, code, name, location, lat, lng, openTime, cutoffTime, capacityTons, managerName, managerPhone, status } = body;

    const warehouseCode = code ? code.trim().toUpperCase() : `WH-${Date.now().toString().slice(-4)}`;

    // Duplicate check on code or name
    const existing = await this.prisma.warehouse.findFirst({
      where: {
        OR: [
          { code: warehouseCode },
          { name: { equals: name.trim(), mode: 'insensitive' } },
        ],
      },
    });

    if (existing) {
      if (existing.code === warehouseCode) {
        throw new ConflictException(`Warehouse with code "${warehouseCode}" already exists`);
      }
      throw new ConflictException(`Warehouse "${name}" already exists`);
    }

    const created = await this.prisma.warehouse.create({
      data: {
        id: id || `FRZ_WH_${Date.now()}`,
        code: warehouseCode,
        name: name.trim(),
        location,
        lat: lat ? parseFloat(lat) : null,
        lng: lng ? parseFloat(lng) : null,
        openTime: openTime || '05:00',
        cutoffTime: cutoffTime || '21:00',
        capacityTons: capacityTons ? parseFloat(capacityTons) : 40,
        managerName: managerName || null,
        managerPhone: managerPhone || null,
        status: status || 'ACTIVE',
      },
    });

    if (body.slots && Array.isArray(body.slots)) {
      const config = readWarehouseSlotsConfig();
      config[created.id] = body.slots;
      config[created.code] = body.slots;
      writeWarehouseSlotsConfig(config);
    }

    return {
      ...created,
      slots: this.resolveWarehouseSlots(created),
    };
  }

  async update(id: string, data: any) {
    const existing = await this.prisma.warehouse.findFirst({
      where: { OR: [{ id }, { uuid: id }, { code: id }] },
    });
    if (!existing) throw new NotFoundException('Warehouse not found');

    const updated = await this.prisma.warehouse.update({
      where: { id: existing.id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.location && { location: data.location }),
        ...(data.lat !== undefined && { lat: parseFloat(data.lat) }),
        ...(data.lng !== undefined && { lng: parseFloat(data.lng) }),
        ...(data.openTime && { openTime: data.openTime }),
        ...(data.cutoffTime && { cutoffTime: data.cutoffTime }),
        ...(data.capacityTons !== undefined && { capacityTons: parseFloat(data.capacityTons) }),
        ...(data.managerName !== undefined && { managerName: data.managerName }),
        ...(data.managerPhone !== undefined && !String(data.managerPhone).includes('••••') && { managerPhone: data.managerPhone }),
        ...(data.status && { status: data.status }),
      },
    });

    if (data.slots && Array.isArray(data.slots)) {
      const config = readWarehouseSlotsConfig();
      config[updated.id] = data.slots;
      config[updated.code] = data.slots;
      writeWarehouseSlotsConfig(config);
    }

    return {
      ...updated,
      slots: this.resolveWarehouseSlots(updated),
    };
  }

  async delete(id: string) {
    const existing = await this.prisma.warehouse.findFirst({
      where: { OR: [{ id }, { uuid: id }, { code: id }] },
    });
    if (!existing) throw new NotFoundException('Warehouse not found');

    // Integrity guard: prevent deletion if mapped to societies
    const mappedSocieties = await this.prisma.society.count({
      where: { warehouseId: existing.id },
    });
    if (mappedSocieties > 0) {
      throw new BadRequestException(
        `Cannot delete warehouse "${existing.name}": ${mappedSocieties} communities are currently mapped to it. Please reassign them first.`,
      );
    }

    // Integrity guard: prevent deletion if linked to orders
    const mappedOrders = await this.prisma.order.count({
      where: { warehouseId: existing.id },
    });
    if (mappedOrders > 0) {
      throw new BadRequestException(
        `Cannot delete warehouse "${existing.name}": ${mappedOrders} orders are associated with it. Please mark it INACTIVE instead of deleting.`,
      );
    }

    return this.prisma.warehouse.delete({ where: { id: existing.id } });
  }
}
