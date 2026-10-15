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
exports.ProcurementBillResponseDto = exports.ProcurementBillSchema = void 0;
const swagger_1 = require("@nestjs/swagger");
class ProcurementBillSchema {
}
exports.ProcurementBillSchema = ProcurementBillSchema;
exports.ProcurementBillResponseDto = ProcurementBillSchema;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'FRZ_BILL_01' }),
    __metadata("design:type", String)
], ProcurementBillSchema.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'APMC/KLR/2026/8841' }),
    __metadata("design:type", String)
], ProcurementBillSchema.prototype, "billNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Kolar Agro Mandi Commission Agents' }),
    __metadata("design:type", String)
], ProcurementBillSchema.prototype, "vendorName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Kolar APMC Mandi Yard' }),
    __metadata("design:type", String)
], ProcurementBillSchema.prototype, "mandiLocation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'FRZ_WH_01' }),
    __metadata("design:type", String)
], ProcurementBillSchema.prototype, "destinationWarehouseId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Bengaluru North Hub (Hebbal)' }),
    __metadata("design:type", String)
], ProcurementBillSchema.prototype, "destinationName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'IMPS_TRANSFER' }),
    __metadata("design:type", String)
], ProcurementBillSchema.prototype, "paymentMode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 50 }),
    __metadata("design:type", Number)
], ProcurementBillSchema.prototype, "totalWeightKg", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1500 }),
    __metadata("design:type", Number)
], ProcurementBillSchema.prototype, "produceAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 250 }),
    __metadata("design:type", Number)
], ProcurementBillSchema.prototype, "transportAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1750 }),
    __metadata("design:type", Number)
], ProcurementBillSchema.prototype, "totalAmountPaid", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Mohan Gowda' }),
    __metadata("design:type", String)
], ProcurementBillSchema.prototype, "procuredBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Morning Fresh Slot' }),
    __metadata("design:type", String)
], ProcurementBillSchema.prototype, "slot", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '14/10/2026' }),
    __metadata("design:type", String)
], ProcurementBillSchema.prototype, "procuredAtFormatted", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '05:30 AM IST' }),
    __metadata("design:type", String)
], ProcurementBillSchema.prototype, "procuredAtTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '14/10/2026, 05:30 AM IST' }),
    __metadata("design:type", String)
], ProcurementBillSchema.prototype, "createdAtFormatted", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: [] }),
    __metadata("design:type", Array)
], ProcurementBillSchema.prototype, "items", void 0);
//# sourceMappingURL=procurement-bill.schema.js.map