import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

export const VALID_EMPLOYEE_ROLES = [
  'SUPER_ADMIN',
  'WAREHOUSE_MANAGER',
  'WAREHOUSE_STAFF',
  'DELIVERY_EXECUTIVE',
  'SALES_OFFICER',
  'PROCUREMENT_OFFICER',
];

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
    const [employees, warehouses] = await Promise.all([
      this.prisma.employee.findMany({
        select: EMPLOYEE_SELECT_FIELDS,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.warehouse.findMany({
        select: { id: true, uuid: true, code: true, name: true },
      }),
    ]);

    const whMap = new Map<string, any>();
    warehouses.forEach(w => {
      whMap.set(w.id, w);
      whMap.set(w.uuid, w);
      if (w.code) whMap.set(w.code, w);
    });

    return employees.map(emp => {
      const wh = emp.assignedWarehouseId && emp.assignedWarehouseId !== 'ALL'
        ? whMap.get(emp.assignedWarehouseId)
        : null;
      const assignedLocationName = wh
        ? wh.name
        : (emp.assignedWarehouseId === 'ALL' || !emp.assignedWarehouseId
          ? 'All Hubs & Warehouses (Citywide)'
          : emp.assignedWarehouseId);

      return {
        ...emp,
        assignedWarehouse: wh || null,
        assignedWarehouseName: assignedLocationName,
        assignedLocationName,
      };
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

    if (emp.assignedWarehouseId && emp.assignedWarehouseId !== 'ALL') {
      const wh = await this.prisma.warehouse.findFirst({
        where: {
          OR: [
            { id: emp.assignedWarehouseId },
            { uuid: emp.assignedWarehouseId },
            { code: emp.assignedWarehouseId },
          ],
        },
        select: { id: true, uuid: true, code: true, name: true },
      });
      return {
        ...emp,
        assignedWarehouse: wh || null,
        assignedWarehouseName: wh ? wh.name : emp.assignedWarehouseId,
        assignedLocationName: wh ? wh.name : emp.assignedWarehouseId,
      };
    }

    return {
      ...emp,
      assignedWarehouse: null,
      assignedWarehouseName: 'All Hubs & Warehouses (Citywide)',
      assignedLocationName: 'All Hubs & Warehouses (Citywide)',
    };
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

    const rawRoles = Array.isArray(roles) ? roles : [roles || 'SALES_OFFICER'];
    for (const r of rawRoles) {
      if (!VALID_EMPLOYEE_ROLES.includes(r)) {
        throw new BadRequestException(`Invalid role: "${r}". Valid roles are: ${VALID_EMPLOYEE_ROLES.join(', ')}`);
      }
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
        roles: rawRoles,
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

    // Role validation
    if (data.roles) {
      const parsedRoles = Array.isArray(data.roles) ? data.roles : [data.roles];
      for (const r of parsedRoles) {
        if (!VALID_EMPLOYEE_ROLES.includes(r)) {
          throw new BadRequestException(`Invalid role: "${r}". Valid roles are: ${VALID_EMPLOYEE_ROLES.join(', ')}`);
        }
      }
    }

    // Protect last active SUPER_ADMIN
    if (existing.roles.includes('SUPER_ADMIN')) {
      const isDemotingOrDeactivating =
        (data.status && data.status !== 'ACTIVE') ||
        (data.roles && !data.roles.includes('SUPER_ADMIN'));

      if (isDemotingOrDeactivating) {
        const otherActiveSuperAdmins = await this.prisma.employee.count({
          where: {
            id: { not: existing.id },
            status: 'ACTIVE',
            roles: { has: 'SUPER_ADMIN' },
          },
        });
        if (otherActiveSuperAdmins === 0) {
          throw new BadRequestException('Cannot deactivate or remove SUPER_ADMIN role from the only active Super Admin.');
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
