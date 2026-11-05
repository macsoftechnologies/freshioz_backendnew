export declare class UpdateOrderStatusDto {
    status?: string;
    paymentStatus?: string;
    codCollectedAmount?: number;
    codCollectedBy?: string;
    codSettledToHub?: boolean;
    codSettledBy?: string;
    codReceivedMode?: string;
    razorpayPaymentId?: string;
    reason?: string;
    cancelledReason?: string;
    deliveryLotId?: string;
    deliveryPartnerId?: string;
    deliveryPartnerName?: string;
    deliveryPartnerPhone?: string;
    vehicleNumber?: string;
    dispatchedBy?: string;
}
