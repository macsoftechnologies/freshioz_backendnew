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
exports.ProductSchema = exports.CategorySchema = void 0;
const swagger_1 = require("@nestjs/swagger");
class CategorySchema {
}
exports.CategorySchema = CategorySchema;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'VEGETABLES' }),
    __metadata("design:type", String)
], CategorySchema.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Fresh Vegetables' }),
    __metadata("design:type", String)
], CategorySchema.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'vegetables' }),
    __metadata("design:type", String)
], CategorySchema.prototype, "slug", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '🥦' }),
    __metadata("design:type", String)
], CategorySchema.prototype, "icon", void 0);
class ProductSchema {
}
exports.ProductSchema = ProductSchema;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'FRZ_PRD_101' }),
    __metadata("design:type", String)
], ProductSchema.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Country Tomatoes (Nati Tomato)' }),
    __metadata("design:type", String)
], ProductSchema.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'ನಾಟಿ ಟೊಮೆಟೊ', required: false }),
    __metadata("design:type", String)
], ProductSchema.prototype, "kannadaName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'VEGETABLES' }),
    __metadata("design:type", String)
], ProductSchema.prototype, "categoryId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: CategorySchema, required: false }),
    __metadata("design:type", CategorySchema)
], ProductSchema.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '1 kg' }),
    __metadata("design:type", String)
], ProductSchema.prototype, "retailUnit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 32 }),
    __metadata("design:type", Number)
], ProductSchema.prototype, "retailPrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 45 }),
    __metadata("design:type", Number)
], ProductSchema.prototype, "retailMarketPrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 5 }),
    __metadata("design:type", Number)
], ProductSchema.prototype, "bulkMinQty", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 10 }),
    __metadata("design:type", Number)
], ProductSchema.prototype, "bulkDiscountPercent", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Kolar APMC Mandi', required: false }),
    __metadata("design:type", String)
], ProductSchema.prototype, "origin", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '4-5 Days', required: false }),
    __metadata("design:type", String)
], ProductSchema.prototype, "shelfLife", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400' }),
    __metadata("design:type", String)
], ProductSchema.prototype, "image", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Harvested Today at Dawn', required: false }),
    __metadata("design:type", String)
], ProductSchema.prototype, "badge", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: ['Salads', 'Curry Essential'] }),
    __metadata("design:type", Array)
], ProductSchema.prototype, "tags", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'ACTIVE' }),
    __metadata("design:type", String)
], ProductSchema.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], ProductSchema.prototype, "inStock", void 0);
//# sourceMappingURL=product.schema.js.map