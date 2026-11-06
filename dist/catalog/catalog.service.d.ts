import { PrismaService } from '../prisma/prisma.service';
import { DeliveryConfig } from './delivery.constants';
export declare class CatalogService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    getPublicCatalog(targetDate?: string): Promise<{
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
            status: string;
            type: string;
            address: string;
            imageUrl: string;
            lat: number;
            lng: number;
            warehouseId: string;
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
        deliveryConfig: DeliveryConfig;
        activeDeliveryDate: string;
        syncedAt: string;
    }>;
    private getFallbackCatalog;
    getDeliveryConfig(): Promise<DeliveryConfig>;
}
