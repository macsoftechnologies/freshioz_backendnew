export declare class ProcurementBillSchema {
    id: string;
    billNumber: string;
    vendorName: string;
    mandiLocation: string;
    destinationWarehouseId: string;
    destinationName: string;
    paymentMode: string;
    totalWeightKg: number;
    produceAmount: number;
    transportAmount: number;
    totalAmountPaid: number;
    procuredBy: string;
    slot: string;
    procuredAtFormatted: string;
    procuredAtTime: string;
    createdAtFormatted: string;
    items: any[];
}
export { ProcurementBillSchema as ProcurementBillResponseDto };
