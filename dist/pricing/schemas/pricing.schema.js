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
exports.DailyPriceResponseDto = exports.PricingDateResponseSchema = exports.DailyPriceHistorySchema = void 0;
const swagger_1 = require("@nestjs/swagger");
class DailyPriceHistorySchema {
}
exports.DailyPriceHistorySchema = DailyPriceHistorySchema;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid-entry-1' }),
    __metadata("design:type", String)
], DailyPriceHistorySchema.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'FRZ_PRD_101' }),
    __metadata("design:type", String)
], DailyPriceHistorySchema.prototype, "productId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 34 }),
    __metadata("design:type", Number)
], DailyPriceHistorySchema.prototype, "retailPrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 48 }),
    __metadata("design:type", Number)
], DailyPriceHistorySchema.prototype, "retailMarketPrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 5 }),
    __metadata("design:type", Number)
], DailyPriceHistorySchema.prototype, "bulkMinQty", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 10 }),
    __metadata("design:type", Number)
], DailyPriceHistorySchema.prototype, "bulkDiscountPercent", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '15/10/2026' }),
    __metadata("design:type", String)
], DailyPriceHistorySchema.prototype, "publishedDateIST", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '06:00 AM IST' }),
    __metadata("design:type", String)
], DailyPriceHistorySchema.prototype, "publishedTimeIST", void 0);
class PricingDateResponseSchema {
}
exports.PricingDateResponseSchema = PricingDateResponseSchema;
exports.DailyPriceResponseDto = PricingDateResponseSchema;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '15/10/2026' }),
    __metadata("design:type", String)
], PricingDateResponseSchema.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [DailyPriceHistorySchema] }),
    __metadata("design:type", Array)
], PricingDateResponseSchema.prototype, "entries", void 0);
//# sourceMappingURL=pricing.schema.js.map