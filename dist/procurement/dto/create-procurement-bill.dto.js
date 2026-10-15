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
exports.CreateProcurementBillDto = exports.ProcurementItemDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class ProcurementItemDto {
}
exports.ProcurementItemDto = ProcurementItemDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Country Tomatoes (Nati Tomato)' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ProcurementItemDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 25 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ProcurementItemDto.prototype, "qty", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 28 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ProcurementItemDto.prototype, "rate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'kg', default: 'kg' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ProcurementItemDto.prototype, "unit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 700 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ProcurementItemDto.prototype, "total", void 0);
class CreateProcurementBillDto {
}
exports.CreateProcurementBillDto = CreateProcurementBillDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'APMC/KLR/2026/8841' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProcurementBillDto.prototype, "billNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'FRZ_VND_01' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProcurementBillDto.prototype, "vendorId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Kolar Agro Mandi Commission Agents' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProcurementBillDto.prototype, "vendorName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Kolar APMC Mandi Yard' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProcurementBillDto.prototype, "mandiLocation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'FRZ_WH_01' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProcurementBillDto.prototype, "destinationWarehouseId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Bengaluru North Hub (Hebbal)' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProcurementBillDto.prototype, "destinationName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'IMPS_TRANSFER', default: 'IMPS_TRANSFER' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProcurementBillDto.prototype, "paymentMode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 50 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateProcurementBillDto.prototype, "totalWeightKg", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1500 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateProcurementBillDto.prototype, "produceAmount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 250, default: 0 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateProcurementBillDto.prototype, "transportAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1750 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateProcurementBillDto.prototype, "totalAmountPaid", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProcurementBillDto.prototype, "receiptPhoto", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Mohan Gowda' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProcurementBillDto.prototype, "procuredBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Morning Fresh Slot', default: 'Morning Fresh Slot' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProcurementBillDto.prototype, "slot", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [ProcurementItemDto] }),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], CreateProcurementBillDto.prototype, "items", void 0);
//# sourceMappingURL=create-procurement-bill.dto.js.map