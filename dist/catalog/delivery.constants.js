"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DELIVERY_CONFIG = void 0;
exports.computeDeliveryFee = computeDeliveryFee;
exports.DELIVERY_CONFIG = {
    baseFee: 25,
    freeDeliveryThreshold: 299,
    enableFreeDelivery: true,
};
function computeDeliveryFee(itemsNetTotal) {
    if (exports.DELIVERY_CONFIG.enableFreeDelivery && itemsNetTotal >= exports.DELIVERY_CONFIG.freeDeliveryThreshold) {
        return 0;
    }
    return exports.DELIVERY_CONFIG.baseFee;
}
//# sourceMappingURL=delivery.constants.js.map