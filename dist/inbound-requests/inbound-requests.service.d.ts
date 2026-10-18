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
            status: string;
            createdAt: Date;
            updatedAt: Date;
            address: string | null;
            contactName: string;
            contactPhone: string;
            contactRole: string | null;
            flatCount: number | null;
            clusterZone: string | null;
        }[];
        unreadCount: number;
    }>;
    create(body: any): Promise<{
        createdDateIST: string;
        createdTimeIST: string;
        id: string;
        uuid: string;
        societyName: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        address: string | null;
        contactName: string;
        contactPhone: string;
        contactRole: string | null;
        flatCount: number | null;
        clusterZone: string | null;
    }>;
    updateStatus(id: string, status: string): Promise<{
        createdDateIST: string;
        createdTimeIST: string;
        id: string;
        uuid: string;
        societyName: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        address: string | null;
        contactName: string;
        contactPhone: string;
        contactRole: string | null;
        flatCount: number | null;
        clusterZone: string | null;
    }>;
}
