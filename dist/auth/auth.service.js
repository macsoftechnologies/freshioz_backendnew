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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = require("bcryptjs");
let AuthService = class AuthService {
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async comparePassword(plain, hashOrPlain) {
        if (!hashOrPlain || !plain)
            return false;
        if (hashOrPlain.startsWith('$2')) {
            return bcrypt.compare(plain, hashOrPlain);
        }
        return plain === hashOrPlain;
    }
    async login(body) {
        const { email, phone, password } = body;
        if (!password) {
            throw new common_1.UnauthorizedException('Password is required');
        }
        if (email) {
            const employee = await this.prisma.employee.findUnique({ where: { email: email.trim().toLowerCase() } });
            if (employee) {
                if (employee.status === 'INACTIVE') {
                    throw new common_1.UnauthorizedException('This employee account has been deactivated');
                }
                const isValid = await this.comparePassword(password, employee.password);
                if (isValid) {
                    const employeeRoles = Array.isArray(employee.roles) ? [...employee.roles] : [];
                    if (employeeRoles.includes('WAREHOUSE_MANAGER') && !employeeRoles.includes('PROCUREMENT_OFFICER')) {
                        employeeRoles.push('PROCUREMENT_OFFICER');
                    }
                    const userPayload = {
                        id: employee.id,
                        uuid: employee.uuid,
                        name: employee.name,
                        email: employee.email,
                        phone: employee.phone,
                        roles: employeeRoles,
                        assignedWarehouseId: employee.assignedWarehouseId,
                        warehouseId: employee.assignedWarehouseId,
                        type: 'EMPLOYEE',
                    };
                    const token = this.jwtService.sign(userPayload);
                    return {
                        success: true,
                        token,
                        tokenType: 'Bearer',
                        expiresIn: '7d',
                        type: 'EMPLOYEE',
                        user: userPayload,
                    };
                }
            }
        }
        if (phone) {
            const cleanPhone = phone.trim().replace(/\D/g, '').slice(-10);
            const user = await this.prisma.user.findFirst({
                where: {
                    OR: [{ phone: cleanPhone }, { phone: phone.trim() }],
                },
                include: { society: true },
            });
            if (user) {
                if (user.status === 'SUSPENDED') {
                    throw new common_1.UnauthorizedException('Account suspended');
                }
                const isValid = await this.comparePassword(password, user.password);
                if (isValid) {
                    const userPayload = {
                        id: user.id,
                        uuid: user.uuid,
                        name: user.name,
                        phone: user.phone,
                        email: user.email || undefined,
                        societyId: user.societyId || undefined,
                        societyName: user.society?.name || undefined,
                        flatNo: user.flatNo || undefined,
                        type: 'CUSTOMER',
                    };
                    const token = this.jwtService.sign(userPayload);
                    return {
                        success: true,
                        token,
                        tokenType: 'Bearer',
                        expiresIn: '7d',
                        type: 'CUSTOMER',
                        user: userPayload,
                    };
                }
            }
        }
        throw new common_1.UnauthorizedException('Invalid credentials. Please verify your email/phone and password.');
    }
    async register(body) {
        const cleanPhone = body.phone.trim().replace(/\D/g, '').slice(-10);
        if (!cleanPhone || cleanPhone.length !== 10) {
            throw new common_1.BadRequestException('Please provide a valid 10-digit mobile number');
        }
        const existing = await this.prisma.user.findFirst({
            where: {
                OR: [{ phone: cleanPhone }, { phone: body.phone.trim() }],
            },
        });
        if (existing) {
            throw new common_1.ConflictException('An account with this mobile number already exists. Please log in.');
        }
        const hashedPassword = await bcrypt.hash(body.password, 10);
        const userId = `USR_${cleanPhone}`;
        let validSocietyId = null;
        let validSocietyName = null;
        if (body.societyId) {
            const socExists = await this.prisma.society.findFirst({
                where: { OR: [{ id: body.societyId }, { uuid: body.societyId }] },
            });
            if (socExists) {
                validSocietyId = socExists.id;
                validSocietyName = socExists.name;
            }
        }
        const user = await this.prisma.user.create({
            data: {
                id: userId,
                name: body.name.trim(),
                phone: cleanPhone,
                password: hashedPassword,
                email: body.email ? body.email.trim().toLowerCase() : null,
                societyId: validSocietyId,
                flatNo: body.flatNo || null,
                status: 'ACTIVE_VERIFIED',
            },
            include: { society: true },
        });
        const userPayload = {
            id: user.id,
            uuid: user.uuid,
            name: user.name,
            phone: user.phone,
            email: user.email || undefined,
            societyId: user.societyId || undefined,
            societyName: user.society?.name || body.societyName || undefined,
            flatNo: user.flatNo || undefined,
            type: 'CUSTOMER',
        };
        const token = this.jwtService.sign(userPayload);
        return {
            success: true,
            token,
            tokenType: 'Bearer',
            expiresIn: '7d',
            type: 'CUSTOMER',
            user: userPayload,
        };
    }
    async partnerLogin(body) {
        const cleanPhone = body.phone.trim().replace(/\D/g, '').slice(-10);
        const society = await this.prisma.society.findFirst({
            where: {
                OR: [
                    ...(body.societyId ? [{ id: body.societyId }, { uuid: body.societyId }] : []),
                    { secretaryPhone: cleanPhone },
                    { secretaryPhone: body.phone.trim() }
                ],
            },
        });
        if (!society) {
            throw new common_1.UnauthorizedException('No registered community found with the specified ID or Phone');
        }
        const secretaryPhoneClean = (society.secretaryPhone || '').replace(/\D/g, '').slice(-10);
        if (secretaryPhoneClean && cleanPhone !== secretaryPhoneClean) {
            throw new common_1.UnauthorizedException('Phone number does not match registered Secretary / Warden on file');
        }
        const configuredPartnerPass = process.env.PARTNER_DEFAULT_PASSWORD;
        if (!configuredPartnerPass && process.env.NODE_ENV === 'production') {
            throw new common_1.InternalServerErrorException('FATAL: PARTNER_DEFAULT_PASSWORD environment variable is required in production mode.');
        }
        const partnerPassToValidate = configuredPartnerPass || 'Freshioz@Society2026';
        const isPassValid = await this.comparePassword(body.password.trim(), partnerPassToValidate);
        if (!isPassValid) {
            throw new common_1.UnauthorizedException('Invalid partner portal password');
        }
        const partnerPayload = {
            id: society.id,
            uuid: society.uuid,
            societyId: society.id,
            societyName: society.name,
            secretaryName: society.secretaryName || 'Community Secretary',
            phone: society.secretaryPhone || body.phone,
            type: 'PARTNER',
            roles: ['SOCIETY_PARTNER'],
        };
        const token = this.jwtService.sign(partnerPayload);
        return {
            success: true,
            token,
            tokenType: 'Bearer',
            expiresIn: '7d',
            type: 'PARTNER',
            user: partnerPayload,
        };
    }
    verifyToken(authHeader) {
        if (!authHeader)
            throw new common_1.UnauthorizedException('No token provided');
        const parts = authHeader.split(' ');
        if (parts.length !== 2 || parts[0].toLowerCase() !== 'bearer') {
            throw new common_1.UnauthorizedException('Invalid token format');
        }
        try {
            const decoded = this.jwtService.verify(parts[1]);
            return { authenticated: true, user: decoded };
        }
        catch {
            throw new common_1.UnauthorizedException('Invalid or expired token');
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map