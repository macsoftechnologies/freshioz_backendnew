import { PrismaService } from '../prisma/prisma.service';
export declare class EmployeesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        id: string;
        uuid: string;
        name: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        roles: string[];
        phone: string;
        email: string;
        assignedWarehouseId: string;
        dateJoined: Date;
    }[]>;
    findOne(idOrUuid: string): Promise<{
        id: string;
        uuid: string;
        name: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        roles: string[];
        phone: string;
        email: string;
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
        roles: string[];
        phone: string;
        email: string;
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
        roles: string[];
        phone: string;
        email: string;
        assignedWarehouseId: string;
        dateJoined: Date;
    }>;
}
