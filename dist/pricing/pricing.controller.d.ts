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
