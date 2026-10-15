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
exports.VendorSchema = void 0;
const swagger_1 = require("@nestjs/swagger");
class VendorSchema {
}
exports.VendorSchema = VendorSchema;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'FRZ_VND_01' }),
    __metadata("design:type", String)
], VendorSchema.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Kolar Agro Mandi Commission Agents' }),
    __metadata("design:type", String)
], VendorSchema.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '9845066778' }),
    __metadata("design:type", String)
], VendorSchema.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'COMMISSION_AGENT' }),
    __metadata("design:type", String)
], VendorSchema.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Kolar APMC Mandi Yard, Gate 2' }),
    __metadata("design:type", String)
], VendorSchema.prototype, "mandiLocation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 13.1362, required: false }),
    __metadata("design:type", Number)
], VendorSchema.prototype, "lat", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 78.1292, required: false }),
    __metadata("design:type", Number)
], VendorSchema.prototype, "lng", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'State Bank of India', required: false }),
    __metadata("design:type", String)
], VendorSchema.prototype, "bankName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Kolar Agro Trading Co', required: false }),
    __metadata("design:type", String)
], VendorSchema.prototype, "accountHolder", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '30112233445', required: false }),
    __metadata("design:type", String)
], VendorSchema.prototype, "accountNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'SBIN0001234', required: false }),
    __metadata("design:type", String)
], VendorSchema.prototype, "ifscCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'kolaragro@sbi', required: false }),
    __metadata("design:type", String)
], VendorSchema.prototype, "upiId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'ACTIVE' }),
    __metadata("design:type", String)
], VendorSchema.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '14/10/2026' }),
    __metadata("design:type", String)
], VendorSchema.prototype, "formattedCreatedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '05:30 AM IST' }),
    __metadata("design:type", String)
], VendorSchema.prototype, "formattedTime", void 0);
//# sourceMappingURL=vendor.schema.js.map