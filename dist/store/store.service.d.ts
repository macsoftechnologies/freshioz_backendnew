import { PrismaService } from '../prisma/prisma.service';
export declare class StoreService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getCombinedStore(currentUser?: any): Promise<{
        warehouses: {
            id: string;
            uuid: string;
            code: string;
            name: string;
            location: string;
            lat: number;
            lng: number;
            openTime: string;
            cutoffTime: string;
            status: string;
            capacityTons: number;
            managerName: string;
            managerPhone: string;
        }[];
        products: {
            id: string;
            name: string;
            kannadaName: string;
            categoryId: string;
            category: string;
            categoryName: string;
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
        orders: any[];
        vendors: any[];
        procurementLogs: any[];
        warehouseInventory: {};
        warehouseInventoryEntries: any[];
        societyRequests: any[];
        employees: {
            id: string;
            uuid: string;
            name: string;
            email: string;
            phone: string;
            roles: string[];
            status: string;
        }[];
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
        }[];
        withdrawals: any[];
        backendConnected: boolean;
        syncedAtIST: string;
    } | {
        warehouses: {
            createdAt: any;
            updatedAt: any;
            capacityTons: any;
            managerName: any;
            id: any;
            uuid: any;
            code: any;
            name: any;
            location: any;
            lat: any;
            lng: any;
            openTime: any;
            cutoffTime: any;
            status: any;
            managerPhone: any;
        }[];
        products: any[];
        societies: any[];
        orders: any[];
        vendors: any[];
        procurementLogs: any[];
        warehouseInventory: Record<string, Record<string, number>>;
        warehouseInventoryEntries: any[];
        societyRequests: any[];
        employees: any[];
        categories: any[];
        units: any[];
        withdrawals: {
            id: any;
            societyId: any;
            societyName: any;
            amount: any;
            status: any;
            bankUtr: any;
            transactionRef: any;
            paymentMethod: any;
            notes: any;
            disbursedBy: any;
            createdAt: any;
        }[];
        backendConnected: boolean;
        syncedAtIST: string;
    }>;
    private getFallbackCombinedStore;
    saveStore(data: any, user?: any): Promise<{
        ok: boolean;
        persisted: string[];
        skipped: string[];
        syncedAtIST: string;
    }>;
}
