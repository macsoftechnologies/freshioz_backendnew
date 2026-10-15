export declare class CreateProductDto {
    id?: string;
    name: string;
    kannadaName?: string;
    categoryId?: string;
    retailUnit?: string;
    retailPrice?: number;
    retailMarketPrice?: number;
    bulkMinQty?: number;
    bulkDiscountPercent?: number;
    origin?: string;
    shelfLife?: string;
    desc?: string;
    image?: string;
    badge?: string;
    tags?: string[];
    gstPercent?: number;
}
