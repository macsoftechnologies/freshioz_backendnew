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
exports.InventoryItemResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class InventoryItemResponseDto {
}
exports.InventoryItemResponseDto = InventoryItemResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'inv_12345' }),
    __metadata("design:type", String)
], InventoryItemResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'WH_HEBBAL_01' }),
    __metadata("design:type", String)
], InventoryItemResponseDto.prototype, "warehouseId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Bengaluru North Hub' }),
    __metadata("design:type", String)
], InventoryItemResponseDto.prototype, "warehouseName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'PRD_TOMATO_01' }),
    __metadata("design:type", String)
], InventoryItemResponseDto.prototype, "productId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Fresh Country Tomatoes' }),
    __metadata("design:type", String)
], InventoryItemResponseDto.prototype, "productName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 85.5 }),
    __metadata("design:type", Number)
], InventoryItemResponseDto.prototype, "currentQty", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 12.0 }),
    __metadata("design:type", Number)
], InventoryItemResponseDto.prototype, "reservedQty", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 73.5, description: 'Available quantity (current - reserved)' }),
    __metadata("design:type", Number)
], InventoryItemResponseDto.prototype, "availableQty", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'kg' }),
    __metadata("design:type", String)
], InventoryItemResponseDto.prototype, "unit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '15/10/2026, 05:30:00 IST' }),
    __metadata("design:type", String)
], InventoryItemResponseDto.prototype, "updatedAtFormatted", void 0);
//# sourceMappingURL=inventory.schema.js.map