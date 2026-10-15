export declare class OrderItemResponseDto {
    id: string;
    productId: string;
    name: string;
    unit: string;
    qty: number;
    price: number;
    effectivePrice?: number;
    totalPrice?: number;
    isBulkApplied?: boolean;
}
export declare class OrderResponseDto {
    id: string;
    userPhone: string;
    userName: string;
    societyName?: string;
    flatNo: string;
    totalAmount: number;
    subtotal: number;
    bulkSavings: number;
    deliveryDate: string;
    deliverySlot: string;
    status: string;
    paymentMethod: string;
    paymentStatus: string;
    items: OrderItemResponseDto[];
    orderPlacedAtFormatted: string;
}
