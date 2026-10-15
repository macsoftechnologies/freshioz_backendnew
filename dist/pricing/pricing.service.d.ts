import { PrismaService } from '../prisma/prisma.service';
export declare class PricingService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getPricesByDate(date?: string): Promise<{
        date: string;
        dateIST: string;
        timestampIST: string;
        entries: {
            id: string;
            name: string;
            retailUnit: string;
            retailPrice: number;
            retailMarketPrice: number;
            bulkMinQty: number;
            bulkDiscountPercent: number;
            origin: string;
            gstPercent: number;
        }[];
    }>;
    batchPublishPrices(body: {
        date?: string;
        publishedById?: string;
        prices?: any[];
        items?: any[];
    }): Promise<{
        success: boolean;
        date: string;
        dateIST: string;
        message: string;
        recordsCount: number;
    }>;
}
