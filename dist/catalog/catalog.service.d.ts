import { PrismaService } from '../prisma/prisma.service';
export declare class CatalogService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getPublicCatalog(targetDate?: string): Promise<{
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
            name: string;
            status: string;
            desc: string;
            tags: string[];
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
            id: string;
            name: string;
            status: string;
            warehouseId: string;
            type: string;
            address: string;
            imageUrl: string;
            lat: number;
            lng: number;
            deliveryMode: string;
        }[];
        warehouses: {
            id: string;
            name: string;
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
