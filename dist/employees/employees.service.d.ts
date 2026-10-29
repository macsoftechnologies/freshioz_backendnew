import { PrismaService } from '../prisma/prisma.service';
export declare class EmployeesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        id: string;
        uuid: string;
        email: string;
        name: string;
        phone: string;
        roles: string[];
        assignedWarehouseId: string;
        status: string;
        dateJoined: Date;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findOne(idOrUuid: string): Promise<{
        id: string;
        uuid: string;
        email: string;
        name: string;
        phone: string;
        roles: string[];
        assignedWarehouseId: string;
        status: string;
        dateJoined: Date;
        createdAt: Date;
        updatedAt: Date;
    }>;
    create(body: any): Promise<{
        id: string;
        uuid: string;
        email: string;
        name: string;
        phone: string;
        roles: string[];
        assignedWarehouseId: string;
        status: string;
        dateJoined: Date;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, data: any): Promise<{
        id: string;
        uuid: string;
        email: string;
        name: string;
        phone: string;
        roles: string[];
        assignedWarehouseId: string;
        status: string;
        dateJoined: Date;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
