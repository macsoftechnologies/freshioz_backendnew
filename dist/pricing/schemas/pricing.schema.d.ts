export declare class DailyPriceHistorySchema {
    id: string;
    productId: string;
    retailPrice: number;
    retailMarketPrice: number;
    bulkMinQty: number;
    bulkDiscountPercent: number;
    publishedDateIST: string;
    publishedTimeIST: string;
}
export declare class PricingDateResponseSchema {
    date: string;
    entries: any[];
}
export { PricingDateResponseSchema as DailyPriceResponseDto };
