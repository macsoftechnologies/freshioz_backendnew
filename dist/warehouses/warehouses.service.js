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
exports.WarehousesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let WarehousesService = class WarehousesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        const list = await this.prisma.warehouse.findMany({
            orderBy: { createdAt: 'asc' },
        });
        return list.map(w => ({
            ...w,
            managerPhone: w.managerPhone ? `••••${w.managerPhone.slice(-4)}` : null,
        }));
    }
    async findOne(idOrCode, isStaff = false) {
        const warehouse = await this.prisma.warehouse.findFirst({
            where: {
                OR: [{ id: idOrCode }, { uuid: idOrCode }, { code: idOrCode }],
            },
            include: isStaff ? { societies: true, inventory: true } : { societies: true },
        });
        if (!warehouse)
            throw new common_1.NotFoundException(`Warehouse #${idOrCode} not found`);
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
            societies: sanitizedSocieties,
            managerPhone: (isStaff && warehouse.managerPhone)
                ? warehouse.managerPhone
                : (warehouse.managerPhone ? `••••${warehouse.managerPhone.slice(-4)}` : null),
            ...(isStaff ? {} : { capacityTons: undefined, inventory: undefined }),
        };
    }
    async create(body) {
        const { id, code, name, location, lat, lng, openTime, cutoffTime, capacityTons, managerName, managerPhone, status } = body;
        const warehouseCode = code ? code.trim().toUpperCase() : `WH-${Date.now().toString().slice(-4)}`;
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
                throw new common_1.ConflictException(`Warehouse with code "${warehouseCode}" already exists`);
            }
            throw new common_1.ConflictException(`Warehouse "${name}" already exists`);
        }
        return this.prisma.warehouse.create({
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
    }
    async update(id, data) {
        const existing = await this.prisma.warehouse.findFirst({
            where: { OR: [{ id }, { uuid: id }, { code: id }] },
        });
        if (!existing)
            throw new common_1.NotFoundException('Warehouse not found');
        return this.prisma.warehouse.update({
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
                ...(data.managerPhone !== undefined && { managerPhone: data.managerPhone }),
                ...(data.status && { status: data.status }),
            },
        });
    }
    async delete(id) {
        const existing = await this.prisma.warehouse.findFirst({
            where: { OR: [{ id }, { uuid: id }, { code: id }] },
        });
        if (!existing)
            throw new common_1.NotFoundException('Warehouse not found');
        return this.prisma.warehouse.delete({ where: { id: existing.id } });
    }
};
exports.WarehousesService = WarehousesService;
exports.WarehousesService = WarehousesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], WarehousesService);
//# sourceMappingURL=warehouses.service.js.map