export declare class ProcurementItemDto {
    name: string;
    qty: number;
    rate: number;
    unit?: string;
    total?: number;
}
export declare class CreateProcurementBillDto {
    billNumber?: string;
    vendorId?: string;
    vendorName: string;
    mandiLocation: string;
    destinationWarehouseId: string;
    destinationName: string;
    paymentMode?: string;
    totalWeightKg: number;
    produceAmount: number;
    transportAmount?: number;
    totalAmountPaid: number;
    receiptPhoto?: string;
    procuredBy?: string;
    slot?: string;
    items: ProcurementItemDto[];
}
