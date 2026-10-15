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
exports.SocietySchema = void 0;
const swagger_1 = require("@nestjs/swagger");
class SocietySchema {
}
exports.SocietySchema = SocietySchema;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'FRZ_SOC_01' }),
    __metadata("design:type", String)
], SocietySchema.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Greenfield Heights Apartment' }),
    __metadata("design:type", String)
], SocietySchema.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'APARTMENT' }),
    __metadata("design:type", String)
], SocietySchema.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Thanisandra Main Road, Bengaluru' }),
    __metadata("design:type", String)
], SocietySchema.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 13.0645, required: false }),
    __metadata("design:type", Number)
], SocietySchema.prototype, "lat", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 77.6321, required: false }),
    __metadata("design:type", Number)
], SocietySchema.prototype, "lng", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'FRZ_WH_01', required: false }),
    __metadata("design:type", String)
], SocietySchema.prototype, "warehouseId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Rajesh Pillai', required: false }),
    __metadata("design:type", String)
], SocietySchema.prototype, "secretaryName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '9845011999', required: false }),
    __metadata("design:type", String)
], SocietySchema.prototype, "secretaryPhone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 14 }),
    __metadata("design:type", Number)
], SocietySchema.prototype, "totalFloors", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 280 }),
    __metadata("design:type", Number)
], SocietySchema.prototype, "totalUnits", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'APPROVED' }),
    __metadata("design:type", String)
], SocietySchema.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'PERCENTAGE' }),
    __metadata("design:type", String)
], SocietySchema.prototype, "commissionType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 3.5 }),
    __metadata("design:type", Number)
], SocietySchema.prototype, "commissionValue", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 0 }),
    __metadata("design:type", Number)
], SocietySchema.prototype, "balanceEarned", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 0 }),
    __metadata("design:type", Number)
], SocietySchema.prototype, "totalOrdersDelivered", void 0);
//# sourceMappingURL=society.schema.js.map