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
exports.UnitsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let UnitsService = class UnitsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(status) {
        const where = {};
        if (status) {
            where.status = status;
        }
        return this.prisma.unit.findMany({
            where,
            orderBy: [{ isBulk: 'asc' }, { createdAt: 'asc' }],
        });
    }
    async findOne(id) {
        const unit = await this.prisma.unit.findUnique({
            where: { id },
        });
        if (!unit) {
            throw new common_1.NotFoundException(`Unit #${id} not found`);
        }
        return unit;
    }
    async create(dto) {
        const rawName = dto.name.trim();
        const id = dto.id?.trim() || `UNIT_${rawName.toUpperCase().replace(/[^A-Z0-9]/g, '_')}`;
        const existing = await this.prisma.unit.findUnique({
            where: { id },
        });
        if (existing) {
            throw new common_1.ConflictException(`Unit with code "${id}" already exists`);
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
    async update(id, dto) {
        const existing = await this.prisma.unit.findUnique({
            where: { id },
        });
        if (!existing) {
            throw new common_1.NotFoundException(`Unit #${id} not found`);
        }
        const data = {};
        if (dto.name !== undefined)
            data.name = dto.name.trim();
        if (dto.label !== undefined)
            data.label = dto.label.trim();
        if (dto.isBulk !== undefined)
            data.isBulk = dto.isBulk;
        if (dto.description !== undefined)
            data.description = dto.description;
        if (dto.status !== undefined)
            data.status = dto.status;
        return this.prisma.unit.update({
            where: { id },
            data,
        });
    }
    async remove(id) {
        const existing = await this.prisma.unit.findUnique({
            where: { id },
        });
        if (!existing) {
            throw new common_1.NotFoundException(`Unit #${id} not found`);
        }
        try {
            return await this.prisma.unit.delete({
                where: { id },
            });
        }
        catch (e) {
            return this.prisma.unit.update({
                where: { id },
                data: { status: 'INACTIVE' },
            });
        }
    }
};
exports.UnitsService = UnitsService;
exports.UnitsService = UnitsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UnitsService);
//# sourceMappingURL=units.service.js.map