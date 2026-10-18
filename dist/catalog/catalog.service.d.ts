import { PrismaService } from '../prisma/prisma.service';
export declare class CatalogService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getPublicCatalog(): Promise<{
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
            id: string;
            name: string;
            status: string;
            desc: string;
            kannadaName: string;
            categoryId: string;
            retailUnit: string;
            retailPrice: number;
            retailMarketPrice: number;
            bulkMinQty: number;
            bulkDiscountPercent: number;
            origin: string;
            shelfLife: string;
            image: string;
            badge: string;
            tags: string[];
            gstPercent: number;
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
        deliveryConfig: import("./delivery.constants").DeliveryConfig;
        syncedAt: string;
    }>;
}
