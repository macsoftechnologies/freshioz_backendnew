import { CatalogService } from './catalog.service';
export declare class CatalogController {
    private readonly catalogService;
    constructor(catalogService: CatalogService);
    getPublicCatalog(date?: string): Promise<{
        categories: {
            description: string;
            name: string;
            id: string;
            slug: string;
            icon: string;
            sortOrder: number;
        }[];
        units: {
            description: string;
            name: string;
            id: string;
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
            name: string;
            id: string;
            status: string;
            tags: string[];
            desc: string;
            kannadaName: string;
            categoryId: string;
            retailUnit: string;
            origin: string;
            shelfLife: string;
            image: string;
            badge: string;
            inStock: boolean;
        }[];
        societies: {
            type: string;
            name: string;
            id: string;
            status: string;
            address: string;
            imageUrl: string;
            lat: number;
            lng: number;
            warehouseId: string;
            deliveryMode: string;
        }[];
        warehouses: {
            name: string;
            id: string;
            status: string;
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
