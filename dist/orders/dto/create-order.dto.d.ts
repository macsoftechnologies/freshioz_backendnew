export declare class CreateOrderItemDto {
    productId: string;
    name: string;
    unit?: string;
    qty?: number;
    price?: number;
    effectivePrice?: number;
    totalPrice?: number;
    isBulkApplied?: boolean;
    bulkDiscountPercent?: number;
    bulkSavings?: number;
}
export declare class CreateOrderDto {
    userPhone: string;
    userName: string;
    societyId?: string;
    societyName?: string;
    flatNo: string;
    warehouseId?: string;
    warehouseCode?: string;
    orderType?: string;
    subtotal?: number;
    bulkSavings?: number;
    deliveryFee?: number;
    gstAmount?: number;
    totalAmount?: number;
    deliveryDate: string;
    deliverySlot: string;
    paymentMethod?: string;
    paymentStatus?: string;
    discountCode?: string;
    discountAmount?: number;
    items: CreateOrderItemDto[];
}
