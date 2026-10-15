import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

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

@Injectable()
export class EmployeesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.employee.findMany({
      select: EMPLOYEE_SELECT_FIELDS,
      orderBy: { createdAt: 'asc' },
    });
  }

  async findOne(idOrUuid: string) {
    const emp = await this.prisma.employee.findFirst({
      where: {
        OR: [{ id: idOrUuid }, { uuid: idOrUuid }],
      },
      select: EMPLOYEE_SELECT_FIELDS,
    });
    if (!emp) throw new NotFoundException(`Employee #${idOrUuid} not found`);
    return emp;
  }

  async create(body: any) {
    const { id, name, phone, email, password, roles, assignedWarehouseId, status } = body;

    // Check for duplicate email or phone
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
        throw new ConflictException(`Employee with email ${email} is already registered`);
      }
      throw new ConflictException(`Employee with phone number ${phone} is already registered`);
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

  async update(id: string, data: any) {
    const existing = await this.prisma.employee.findFirst({
      where: {
        OR: [{ id }, { uuid: id }],
      },
    });
    if (!existing) throw new NotFoundException('Employee not found');

    // Duplicate check on update
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
          throw new ConflictException(`Employee with email ${data.email} is already registered`);
        }
        if (data.phone && duplicate.phone === data.phone.trim()) {
          throw new ConflictException(`Employee with phone number ${data.phone} is already registered`);
        }
      }
    }

    const updateData: any = {};
    if (data.name) updateData.name = data.name;
    if (data.phone) updateData.phone = data.phone.trim();
    if (data.email) updateData.email = data.email.trim().toLowerCase();
    if (data.roles) updateData.roles = Array.isArray(data.roles) ? data.roles : [data.roles];
    if (data.assignedWarehouseId !== undefined) updateData.assignedWarehouseId = data.assignedWarehouseId;
    if (data.status) updateData.status = data.status;

    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10);
    }

    return this.prisma.employee.update({
      where: { id: existing.id },
      data: updateData,
      select: EMPLOYEE_SELECT_FIELDS,
    });
  }
}
