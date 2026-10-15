import { PrismaService } from '../prisma/prisma.service';
export declare class HealthController {
    private readonly prisma;
    constructor(prisma: PrismaService);
    check(): Promise<{
        status: string;
        service: string;
        serverTimeIST: string;
        database: string;
        databaseLatencyMs: number;
        tableCounts: any;
    }>;
}
