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
exports.VendorsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const date_utils_1 = require("../common/date-utils");
let VendorsService = class VendorsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
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
            formattedCreatedAt: (0, date_utils_1.formatDateIST)(v.createdAt),
            formattedTime: (0, date_utils_1.formatTimeIST)(v.createdAt),
        }));
    }
    async findOne(idOrUuid) {
        const vendor = await this.prisma.vendor.findFirst({
            where: {
                OR: [{ id: idOrUuid }, { uuid: idOrUuid }],
            },
        });
        if (!vendor)
            throw new common_1.NotFoundException(`Vendor #${idOrUuid} not found`);
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
            formattedCreatedAt: (0, date_utils_1.formatDateIST)(vendor.createdAt),
            formattedTime: (0, date_utils_1.formatTimeIST)(vendor.createdAt),
        };
    }
    async create(body) {
        const { id, name, phone, category, mandiLocation, lat, lng, status } = body;
        const bankName = body.bankName || body.bankDetails?.bankName || null;
        const accountHolder = body.accountHolder || body.contactPerson || body.bankDetails?.accountHolder || null;
        const accountNumber = body.accountNumber || body.bankDetails?.accountNumber || null;
        const ifscCode = body.ifscCode || body.bankDetails?.ifscCode || null;
        const upiId = body.upiId || body.bankDetails?.upiId || null;
        const cleanPhone = phone ? phone.trim() : '';
        if (cleanPhone) {
            const existing = await this.prisma.vendor.findFirst({
                where: { phone: cleanPhone },
            });
            if (existing) {
                throw new common_1.ConflictException(`Vendor with phone number "${cleanPhone}" is already registered`);
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
            formattedCreatedAt: (0, date_utils_1.formatDateIST)(newVendor.createdAt),
            formattedTime: (0, date_utils_1.formatTimeIST)(newVendor.createdAt),
        };
    }
    async update(idOrUuid, data) {
        const existing = await this.prisma.vendor.findFirst({
            where: {
                OR: [{ id: idOrUuid }, { uuid: idOrUuid }],
            },
        });
        if (!existing)
            throw new common_1.NotFoundException('Vendor not found');
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
            formattedCreatedAt: (0, date_utils_1.formatDateIST)(updated.createdAt),
            formattedTime: (0, date_utils_1.formatTimeIST)(updated.createdAt),
        };
    }
};
exports.VendorsService = VendorsService;
exports.VendorsService = VendorsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], VendorsService);
//# sourceMappingURL=vendors.service.js.map