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
exports.BatchPricingDto = exports.ProductPriceItemDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class ProductPriceItemDto {
}
exports.ProductPriceItemDto = ProductPriceItemDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'FRZ_PRD_101' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ProductPriceItemDto.prototype, "productId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 34 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ProductPriceItemDto.prototype, "retailPrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 48 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ProductPriceItemDto.prototype, "retailMarketPrice", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 5, default: 0 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ProductPriceItemDto.prototype, "bulkMinQty", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 10, default: 0 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ProductPriceItemDto.prototype, "bulkDiscountPercent", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 0, default: 0 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ProductPriceItemDto.prototype, "gstPercent", void 0);
class BatchPricingDto {
}
exports.BatchPricingDto = BatchPricingDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '15/10/2026', description: 'Pricing effective date in DD/MM/YYYY' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BatchPricingDto.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'FRZ_EMP_101' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BatchPricingDto.prototype, "publishedById", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [ProductPriceItemDto] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => ProductPriceItemDto),
    __metadata("design:type", Array)
], BatchPricingDto.prototype, "prices", void 0);
//# sourceMappingURL=batch-pricing.dto.js.map