export declare class SocietySchema {
    id: string;
    name: string;
    type: string;
    address: string;
    lat?: number;
    lng?: number;
    warehouseId?: string;
    secretaryName?: string;
    secretaryPhone?: string;
    totalFloors: number;
    totalUnits: number;
    status: string;
    commissionType: string;
    commissionValue: number;
    balanceEarned: number;
    totalOrdersDelivered: number;
}
