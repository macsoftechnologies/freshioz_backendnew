import { CatalogService } from './catalog.service';
export declare class CatalogController {
    private readonly catalogService;
    constructor(catalogService: CatalogService);
    getPublicCatalog(date?: string): Promise<{
        categories: {
            id: string;
            name: string;
            description: string;
            slug: string;
            icon: string;
            sortOrder: number;
        }[];
        units: {
            id: string;
            name: string;
            description: string;
            label: string;
            isBulk: boolean;
        }[];
        products: {
            category: string;
            retailPrice: any;
            retailMarketPrice: any;
            bulkMinQty: any;
            bulkDiscountPercent: any;
            gstPercent: any;
            hasCustomDailyPrice: boolean;
            id: string;
            status: string;
            desc: string;
            name: string;
            kannadaName: string;
            categoryId: string;
            retailUnit: string;
            origin: string;
            shelfLife: string;
            image: string;
            badge: string;
            tags: string[];
            inStock: boolean;
        }[];
        societies: {
            id: string;
            warehouseId: string;
            status: string;
            name: string;
            type: string;
            address: string;
            imageUrl: string;
            lat: number;
            lng: number;
            deliveryMode: string;
        }[];
        warehouses: {
            id: string;
            status: string;
            name: string;
            lat: number;
            lng: number;
            code: string;
            location: string;
            openTime: string;
            cutoffTime: string;
        }[];
        deliveryConfig: import("./delivery.constants").DeliveryConfig;
        activeDeliveryDate: string;
        syncedAt: string;
    }>;
}
