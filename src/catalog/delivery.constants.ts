export interface DeliveryConfig {
  baseFee: number;
  freeDeliveryThreshold: number;
  enableFreeDelivery: boolean;
}

export const DELIVERY_CONFIG: DeliveryConfig = {
  baseFee: 25,
  freeDeliveryThreshold: 299,
  enableFreeDelivery: true,
};

export function computeDeliveryFee(itemsNetTotal: number): number {
  if (DELIVERY_CONFIG.enableFreeDelivery && itemsNetTotal >= DELIVERY_CONFIG.freeDeliveryThreshold) {
    return 0;
  }
  return DELIVERY_CONFIG.baseFee;
}
