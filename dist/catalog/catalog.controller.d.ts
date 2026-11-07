import { CatalogService } from './catalog.service';
export declare class CatalogController {
    private readonly catalogService;
    constructor(catalogService: CatalogService);
    getPublicCatalog(date?: string): Promise<{
        categories: {
            id: string;
            name: string;
            slug: string;
            icon: string;
            description: string;
            sortOrder: number;
        }[];
        units: {
            id: string;
            name: string;
            label: string;
            isBulk: boolean;
            description: string;
        }[];
        products: {
            id: string;
            name: string;
            kannadaName: string;
            categoryId: string;
            category: string;
            retailUnit: string;
            retailPrice: number;
            retailMarketPrice: number;
            bulkMinQty: number;
            bulkDiscountPercent: number;
            origin: string;
            shelfLife: string;
            desc: string;
            image: string;
            badge: string;
            tags: string[];
            gstPercent: number;
            status: string;
            inStock: boolean;
            hasCustomDailyPrice: boolean;
        }[];
        societies: {
            id: string;
            name: string;
            type: string;
            address: string;
            imageUrl: string;
            lat: number;
            lng: number;
            warehouseId: string;
            deliveryMode: string;
            status: string;
        }[];
        warehouses: {
            id: string;
            code: string;
            name: string;
            location: string;
            lat: number;
            lng: number;
            openTime: string;
            cutoffTime: string;
            status: string;
        }[];
        deliveryConfig: import("./delivery.constants").DeliveryConfig;
        activeDeliveryDate: string;
        syncedAt: string;
    } | {
        categories: {
            id: string;
            name: string;
            slug: string;
            icon: string;
            description: string;
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
            name: string;
            status: string;
            desc: string;
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
            name: string;
            lat: number;
            lng: number;
            status: string;
            type: string;
            address: string;
            imageUrl: string;
            warehouseId: string;
            deliveryMode: string;
        }[];
        warehouses: {
            slots: any[];
            id: string;
            code: string;
            name: string;
            location: string;
            lat: number;
            lng: number;
            openTime: string;
            cutoffTime: string;
            status: string;
        }[];
        deliveryConfig: import("./delivery.constants").DeliveryConfig;
        activeDeliveryDate: string;
        syncedAt: string;
    }>;
}
