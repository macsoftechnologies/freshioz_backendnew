export declare class MisQueryDto {
    range?: 'today' | 'yesterday' | '7d' | '30d' | 'mtd' | 'custom';
    startDate?: string;
    endDate?: string;
    warehouseId?: string;
}
export declare class ReconcileRiderCashDto {
    riderPhone: string;
    amountSettled: number;
    settledBy: string;
    notes?: string;
}
