import { Injectable, UnauthorizedException, BadRequestException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { RegisterDto, PartnerLoginDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async comparePassword(plain: string, hashOrPlain: string): Promise<boolean> {
    if (!hashOrPlain || !plain) return false;
    if (hashOrPlain.startsWith('$2')) {
      return bcrypt.compare(plain, hashOrPlain);
    }
    return plain === hashOrPlain;
  }

  async login(body: { email?: string; phone?: string; password?: string }) {
    const { email, phone, password } = body;

    if (!password) {
      throw new UnauthorizedException('Password is required');
    }

    // 1. Employee Login
    if (email) {
      const employee = await this.prisma.employee.findUnique({ where: { email: email.trim().toLowerCase() } });
      if (employee) {
        if (employee.status === 'INACTIVE') {
          throw new UnauthorizedException('This employee account has been deactivated');
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

    // 2. Customer / Resident Login
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
          throw new UnauthorizedException('Account suspended');
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

    throw new UnauthorizedException('Invalid credentials. Please verify your email/phone and password.');
  }

  async register(body: RegisterDto) {
    const cleanPhone = body.phone.trim().replace(/\D/g, '').slice(-10);
    if (!cleanPhone || cleanPhone.length !== 10) {
      throw new BadRequestException('Please provide a valid 10-digit mobile number');
    }

    const existing = await this.prisma.user.findFirst({
      where: {
        OR: [{ phone: cleanPhone }, { phone: body.phone.trim() }],
      },
    });

    if (existing) {
      throw new ConflictException('An account with this mobile number already exists. Please log in.');
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);
    const userId = `USR_${cleanPhone}`;

    // Validate if societyId actually exists in database before setting foreign key
    let validSocietyId: string | null = null;
    let validSocietyName: string | null = null;
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

  async partnerLogin(body: PartnerLoginDto) {
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
      throw new UnauthorizedException('No registered community found with the specified ID or Phone');
    }

    const secretaryPhoneClean = (society.secretaryPhone || '').replace(/\D/g, '').slice(-10);
    if (secretaryPhoneClean && cleanPhone !== secretaryPhoneClean) {
      throw new UnauthorizedException('Phone number does not match registered Secretary / Warden on file');
    }

    const configuredPartnerPass = process.env.PARTNER_DEFAULT_PASSWORD;
    if (!configuredPartnerPass && process.env.NODE_ENV === 'production') {
      throw new InternalServerErrorException(
        'FATAL: PARTNER_DEFAULT_PASSWORD environment variable is required in production mode.',
      );
    }
    const partnerPassToValidate = configuredPartnerPass || 'Freshioz@Society2026';
    const isPassValid = await this.comparePassword(body.password.trim(), partnerPassToValidate);
    if (!isPassValid) {
      throw new UnauthorizedException('Invalid partner portal password');
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

  verifyToken(authHeader?: string) {
    if (!authHeader) throw new UnauthorizedException('No token provided');
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0].toLowerCase() !== 'bearer') {
      throw new UnauthorizedException('Invalid token format');
    }

    try {
      const decoded = this.jwtService.verify(parts[1]);
      return { authenticated: true, user: decoded };
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
