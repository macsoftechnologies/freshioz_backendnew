import { PrismaService } from '../prisma/prisma.service';
export declare class InboundRequestsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        leads: {
            createdDateIST: string;
            createdTimeIST: string;
            id: string;
            uuid: string;
            societyName: string;
            contactName: string;
            contactPhone: string;
            contactRole: string | null;
            flatCount: number | null;
            clusterZone: string | null;
            address: string | null;
            status: string;
            createdAt: Date;
            updatedAt: Date;
        }[];
        unreadCount: number;
    }>;
    create(body: any): Promise<{
        createdDateIST: string;
        createdTimeIST: string;
        id: string;
        uuid: string;
        societyName: string;
        contactName: string;
        contactPhone: string;
        contactRole: string | null;
        flatCount: number | null;
        clusterZone: string | null;
        address: string | null;
        status: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateStatus(id: string, status: string): Promise<{
        createdDateIST: string;
        createdTimeIST: string;
        id: string;
        uuid: string;
        societyName: string;
        contactName: string;
        contactPhone: string;
        contactRole: string | null;
        flatCount: number | null;
        clusterZone: string | null;
        address: string | null;
        status: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
