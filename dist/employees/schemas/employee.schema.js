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
exports.EmployeeSchema = void 0;
const swagger_1 = require("@nestjs/swagger");
class EmployeeSchema {
}
exports.EmployeeSchema = EmployeeSchema;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'FRZ_EMP_102' }),
    __metadata("design:type", String)
], EmployeeSchema.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Ravi Sharma' }),
    __metadata("design:type", String)
], EmployeeSchema.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '9845099887' }),
    __metadata("design:type", String)
], EmployeeSchema.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'salesperson@freshioz.com' }),
    __metadata("design:type", String)
], EmployeeSchema.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: ['SALES_OFFICER'] }),
    __metadata("design:type", Array)
], EmployeeSchema.prototype, "roles", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'ALL' }),
    __metadata("design:type", String)
], EmployeeSchema.prototype, "assignedWarehouseId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'ACTIVE' }),
    __metadata("design:type", String)
], EmployeeSchema.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-01-01T00:00:00.000Z' }),
    __metadata("design:type", Date)
], EmployeeSchema.prototype, "dateJoined", void 0);
//# sourceMappingURL=employee.schema.js.map