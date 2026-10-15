"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderResponseDto = exports.OrderItemResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class OrderItemResponseDto {
}
exports.OrderItemResponseDto = OrderItemResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'item_123' }),
    __metadata("design:type", String)
], OrderItemResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'PRD_TOMATO_01' }),
    __metadata("design:type", String)
], OrderItemResponseDto.prototype, "productId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Fresh Country Tomatoes (Nati Tomato)' }),
    __metadata("design:type", String)
], OrderItemResponseDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '1 kg' }),
    __metadata("design:type", String)
], OrderItemResponseDto.prototype, "unit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 2 }),
    __metadata("design:type", Number)
], OrderItemResponseDto.prototype, "qty", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 40 }),
    __metadata("design:type", Number)
], OrderItemResponseDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 36 }),
    __metadata("design:type", Number)
], OrderItemResponseDto.prototype, "effectivePrice", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 72 }),
    __metadata("design:type", Number)
], OrderItemResponseDto.prototype, "totalPrice", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: true }),
    __metadata("design:type", Boolean)
], OrderItemResponseDto.prototype, "isBulkApplied", void 0);
class OrderResponseDto {
}
exports.OrderResponseDto = OrderResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'FRZ-ORD-8891' }),
    __metadata("design:type", String)
], OrderResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '9876543210' }),
    __metadata("design:type", String)
], OrderResponseDto.prototype, "userPhone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Karthik Rao' }),
    __metadata("design:type", String)
], OrderResponseDto.prototype, "userName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Prestige Falcon City' }),
    __metadata("design:type", String)
], OrderResponseDto.prototype, "societyName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Tower 4 - Flat 802' }),
    __metadata("design:type", String)
], OrderResponseDto.prototype, "flatNo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 252 }),
    __metadata("design:type", Number)
], OrderResponseDto.prototype, "totalAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 280 }),
    __metadata("design:type", Number)
], OrderResponseDto.prototype, "subtotal", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 28 }),
    __metadata("design:type", Number)
], OrderResponseDto.prototype, "bulkSavings", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '16/10/2026', description: 'Strict DD/MM/YYYY date' }),
    __metadata("design:type", String)
], OrderResponseDto.prototype, "deliveryDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Morning 06:00 AM - 08:30 AM' }),
    __metadata("design:type", String)
], OrderResponseDto.prototype, "deliverySlot", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'CONFIRMED' }),
    __metadata("design:type", String)
], OrderResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'UPI' }),
    __metadata("design:type", String)
], OrderResponseDto.prototype, "paymentMethod", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'PAID' }),
    __metadata("design:type", String)
], OrderResponseDto.prototype, "paymentStatus", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [OrderItemResponseDto] }),
    __metadata("design:type", Array)
], OrderResponseDto.prototype, "items", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '15/10/2026, 05:30:00 IST' }),
    __metadata("design:type", String)
], OrderResponseDto.prototype, "orderPlacedAtFormatted", void 0);
//# sourceMappingURL=order.schema.js.map