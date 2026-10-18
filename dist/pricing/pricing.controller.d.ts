import { PricingService } from './pricing.service';
export declare class PricingController {
    private readonly pricingService;
    constructor(pricingService: PricingService);
    getPrices(date?: string): Promise<{
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
    batchPublishBatch(body: any): Promise<{
        success: boolean;
        date: string;
        dateIST: string;
        message: string;
        recordsCount: number;
    }>;
    batchPublish(body: any): Promise<{
        success: boolean;
        date: string;
        dateIST: string;
        message: string;
        recordsCount: number;
    }>;
}
