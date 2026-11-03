import { PrismaService } from '../prisma/prisma.service';
export declare class CatalogService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    getPublicCatalog(targetDate?: string): Promise<{
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
    private getFallbackCatalog;
}
