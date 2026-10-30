import { CreateOrderDto } from '../../orders/dto/create-order.dto';
export declare class VerifyRazorpayPaymentDto {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
    orderPayload: CreateOrderDto;
}
