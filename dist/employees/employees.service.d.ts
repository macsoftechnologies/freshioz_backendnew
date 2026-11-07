import { PrismaService } from '../prisma/prisma.service';
export declare const VALID_EMPLOYEE_ROLES: string[];
export declare class EmployeesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(warehouseId?: string): Promise<{
        assignedWarehouse: any;
        assignedWarehouseName: any;
        assignedLocationName: any;
        id: string;
        uuid: string;
        name: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        phone: string;
        email: string;
        roles: string[];
        assignedWarehouseId: string;
        dateJoined: Date;
    }[]>;
    findOne(idOrUuid: string): Promise<{
        assignedWarehouse: {
            id: string;
            uuid: string;
            code: string;
            name: string;
        };
        assignedWarehouseName: string;
        assignedLocationName: string;
        id: string;
        uuid: string;
        name: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        phone: string;
        email: string;
        roles: string[];
        assignedWarehouseId: string;
        dateJoined: Date;
    }>;
    create(body: any): Promise<{
        id: string;
        uuid: string;
        name: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        phone: string;
        email: string;
        roles: string[];
        assignedWarehouseId: string;
        dateJoined: Date;
    }>;
    update(id: string, data: any): Promise<{
        id: string;
        uuid: string;
        name: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        phone: string;
        email: string;
        roles: string[];
        assignedWarehouseId: string;
        dateJoined: Date;
    }>;
}
