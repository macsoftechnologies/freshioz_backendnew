export declare class InventoryItemResponseDto {
    id: string;
    warehouseId: string;
    warehouseName?: string;
    productId: string;
    productName?: string;
    currentQty: number;
    reservedQty: number;
    availableQty: number;
    unit: string;
    updatedAtFormatted: string;
}
