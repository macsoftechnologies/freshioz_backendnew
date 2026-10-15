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
exports.StoreStateResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class StoreStateResponseDto {
}
exports.StoreStateResponseDto = StoreStateResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Array)
], StoreStateResponseDto.prototype, "warehouses", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Array)
], StoreStateResponseDto.prototype, "products", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Array)
], StoreStateResponseDto.prototype, "societies", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Array)
], StoreStateResponseDto.prototype, "orders", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Array)
], StoreStateResponseDto.prototype, "vendors", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Array)
], StoreStateResponseDto.prototype, "procurementLogs", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Object)
], StoreStateResponseDto.prototype, "warehouseInventory", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Array)
], StoreStateResponseDto.prototype, "societyRequests", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Array)
], StoreStateResponseDto.prototype, "categories", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Array)
], StoreStateResponseDto.prototype, "units", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Array)
], StoreStateResponseDto.prototype, "employees", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '15/10/2026, 05:30:00 IST' }),
    __metadata("design:type", String)
], StoreStateResponseDto.prototype, "syncedAtIST", void 0);
//# sourceMappingURL=store.schema.js.map