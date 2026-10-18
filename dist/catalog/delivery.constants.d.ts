export interface DeliveryConfig {
    baseFee: number;
    freeDeliveryThreshold: number;
    enableFreeDelivery: boolean;
}
export declare const DELIVERY_CONFIG: DeliveryConfig;
export declare function computeDeliveryFee(itemsNetTotal: number): number;
