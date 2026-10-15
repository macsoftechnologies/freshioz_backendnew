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
exports.EmployeesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = require("bcryptjs");
const EMPLOYEE_SELECT_FIELDS = {
    id: true,
    uuid: true,
    name: true,
    phone: true,
    email: true,
    roles: true,
    assignedWarehouseId: true,
    status: true,
    dateJoined: true,
    createdAt: true,
    updatedAt: true,
};
let EmployeesService = class EmployeesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        return this.prisma.employee.findMany({
            select: EMPLOYEE_SELECT_FIELDS,
            orderBy: { createdAt: 'asc' },
        });
    }
    async findOne(idOrUuid) {
        const emp = await this.prisma.employee.findFirst({
            where: {
                OR: [{ id: idOrUuid }, { uuid: idOrUuid }],
            },
            select: EMPLOYEE_SELECT_FIELDS,
        });
        if (!emp)
            throw new common_1.NotFoundException(`Employee #${idOrUuid} not found`);
        return emp;
    }
    async create(body) {
        const { id, name, phone, email, password, roles, assignedWarehouseId, status } = body;
        const existing = await this.prisma.employee.findFirst({
            where: {
                OR: [
                    { email: email.trim().toLowerCase() },
                    { phone: phone.trim() },
                ],
            },
        });
        if (existing) {
            if (existing.email === email.trim().toLowerCase()) {
                throw new common_1.ConflictException(`Employee with email ${email} is already registered`);
            }
            throw new common_1.ConflictException(`Employee with phone number ${phone} is already registered`);
        }
        const rawPassword = password || 'Freshioz@123';
        const hashedPassword = await bcrypt.hash(rawPassword, 10);
        return this.prisma.employee.create({
            data: {
                id: id || `FRZ_EMP_${Date.now()}`,
                name,
                phone: phone.trim(),
                email: email.trim().toLowerCase(),
                password: hashedPassword,
                roles: Array.isArray(roles) ? roles : [roles || 'SALES_OFFICER'],
                assignedWarehouseId: assignedWarehouseId || 'ALL',
                status: status || 'ACTIVE',
            },
            select: EMPLOYEE_SELECT_FIELDS,
        });
    }
    async update(id, data) {
        const existing = await this.prisma.employee.findFirst({
            where: {
                OR: [{ id }, { uuid: id }],
            },
        });
        if (!existing)
            throw new common_1.NotFoundException('Employee not found');
        if (data.email || data.phone) {
            const duplicate = await this.prisma.employee.findFirst({
                where: {
                    id: { not: existing.id },
                    OR: [
                        ...(data.email ? [{ email: data.email.trim().toLowerCase() }] : []),
                        ...(data.phone ? [{ phone: data.phone.trim() }] : []),
                    ],
                },
            });
            if (duplicate) {
                if (data.email && duplicate.email === data.email.trim().toLowerCase()) {
                    throw new common_1.ConflictException(`Employee with email ${data.email} is already registered`);
                }
                if (data.phone && duplicate.phone === data.phone.trim()) {
                    throw new common_1.ConflictException(`Employee with phone number ${data.phone} is already registered`);
                }
            }
        }
        const updateData = {};
        if (data.name)
            updateData.name = data.name;
        if (data.phone)
            updateData.phone = data.phone.trim();
        if (data.email)
            updateData.email = data.email.trim().toLowerCase();
        if (data.roles)
            updateData.roles = Array.isArray(data.roles) ? data.roles : [data.roles];
        if (data.assignedWarehouseId !== undefined)
            updateData.assignedWarehouseId = data.assignedWarehouseId;
        if (data.status)
            updateData.status = data.status;
        if (data.password) {
            updateData.password = await bcrypt.hash(data.password, 10);
        }
        return this.prisma.employee.update({
            where: { id: existing.id },
            data: updateData,
            select: EMPLOYEE_SELECT_FIELDS,
        });
    }
};
exports.EmployeesService = EmployeesService;
exports.EmployeesService = EmployeesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EmployeesService);
//# sourceMappingURL=employees.service.js.map