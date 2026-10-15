export declare class ProductPriceItemDto {
    productId: string;
    retailPrice: number;
    retailMarketPrice: number;
    bulkMinQty?: number;
    bulkDiscountPercent?: number;
    gstPercent?: number;
}
export declare class BatchPricingDto {
    date?: string;
    publishedById?: string;
    prices: ProductPriceItemDto[];
}
