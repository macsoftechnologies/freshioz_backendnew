export declare class AdjustStockDto {
    warehouseId: string;
    productId: string;
    qty: number;
    action?: 'ADD' | 'SET' | 'REDUCE';
    remarks?: string;
}
