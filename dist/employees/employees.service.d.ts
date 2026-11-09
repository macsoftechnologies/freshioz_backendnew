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
        updatedAt: Date;
        name: string;
        uuid: string;
        status: string;
        createdAt: Date;
        phone: string;
        email: string;
        roles: string[];
        assignedWarehouseId: string;
        dateJoined: Date;
    }[]>;
    findOne(idOrUuid: string): Promise<{
        assignedWarehouse: {
            id: string;
            name: string;
            uuid: string;
            code: string;
        };
        assignedWarehouseName: string;
        assignedLocationName: string;
        id: string;
        updatedAt: Date;
        name: string;
        uuid: string;
        status: string;
        createdAt: Date;
        phone: string;
        email: string;
        roles: string[];
        assignedWarehouseId: string;
        dateJoined: Date;
    }>;
    create(body: any): Promise<{
        id: string;
        updatedAt: Date;
        name: string;
        uuid: string;
        status: string;
        createdAt: Date;
        phone: string;
        email: string;
        roles: string[];
        assignedWarehouseId: string;
        dateJoined: Date;
    }>;
    update(id: string, data: any): Promise<{
        id: string;
        updatedAt: Date;
        name: string;
        uuid: string;
        status: string;
        createdAt: Date;
        phone: string;
        email: string;
        roles: string[];
        assignedWarehouseId: string;
        dateJoined: Date;
    }>;
}
