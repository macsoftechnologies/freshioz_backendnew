export declare class CategorySchema {
    id: string;
    name: string;
    slug: string;
    icon: string;
}
export declare class ProductSchema {
    id: string;
    name: string;
    kannadaName?: string;
    categoryId: string;
    category?: CategorySchema;
    retailUnit: string;
    retailPrice: number;
    retailMarketPrice: number;
    bulkMinQty: number;
    bulkDiscountPercent: number;
    origin?: string;
    shelfLife?: string;
    image: string;
    badge?: string;
    tags: string[];
    status: string;
    inStock: boolean;
}
