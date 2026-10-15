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
exports.WarehouseSchema = void 0;
const swagger_1 = require("@nestjs/swagger");
class WarehouseSchema {
}
exports.WarehouseSchema = WarehouseSchema;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'FRZ_WH_01' }),
    __metadata("design:type", String)
], WarehouseSchema.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'WH-BLR-NORTH' }),
    __metadata("design:type", String)
], WarehouseSchema.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Bengaluru North Hub (Hebbal)' }),
    __metadata("design:type", String)
], WarehouseSchema.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Hebbal Ring Road, Bengaluru' }),
    __metadata("design:type", String)
], WarehouseSchema.prototype, "location", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 13.0358, required: false }),
    __metadata("design:type", Number)
], WarehouseSchema.prototype, "lat", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 77.5970, required: false }),
    __metadata("design:type", Number)
], WarehouseSchema.prototype, "lng", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '05:00' }),
    __metadata("design:type", String)
], WarehouseSchema.prototype, "openTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '21:00' }),
    __metadata("design:type", String)
], WarehouseSchema.prototype, "cutoffTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 45 }),
    __metadata("design:type", Number)
], WarehouseSchema.prototype, "capacityTons", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Suresh Kumar', required: false }),
    __metadata("design:type", String)
], WarehouseSchema.prototype, "managerName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '9845012345', required: false }),
    __metadata("design:type", String)
], WarehouseSchema.prototype, "managerPhone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'ACTIVE' }),
    __metadata("design:type", String)
], WarehouseSchema.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-10-14T00:00:00.000Z' }),
    __metadata("design:type", Date)
], WarehouseSchema.prototype, "createdAt", void 0);
//# sourceMappingURL=warehouse.schema.js.map