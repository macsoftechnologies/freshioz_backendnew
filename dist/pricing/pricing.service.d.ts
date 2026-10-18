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
            productId: string;
            name: string;
            kannadaName: string;
            categoryId: string;
            retailUnit: string;
            retailPrice: any;
            retailMarketPrice: any;
            bulkMinQty: any;
            bulkDiscountPercent: any;
            origin: string;
            shelfLife: string;
            desc: string;
            image: string;
            badge: string;
            tags: string[];
            gstPercent: any;
            status: string;
            inStock: boolean;
            hasCustomDailyPrice: boolean;
            dailyPriceDate: string;
        }[];
    }>;
    batchPublishPrices(body: {
        date?: string;
        publishedById?: string;
        prices?: any[];
        items?: any[];
        products?: any[];
    }): Promise<{
        success: boolean;
        date: string;
        dateIST: string;
        message: string;
        recordsCount: number;
    }>;
}
