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
exports.AuthResponseSchema = exports.AuthUserSchema = void 0;
const swagger_1 = require("@nestjs/swagger");
class AuthUserSchema {
}
exports.AuthUserSchema = AuthUserSchema;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'FRZ_EMP_101' }),
    __metadata("design:type", String)
], AuthUserSchema.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Super Admin' }),
    __metadata("design:type", String)
], AuthUserSchema.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'superadmin@gmail.com', required: false }),
    __metadata("design:type", String)
], AuthUserSchema.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '9999999999', required: false }),
    __metadata("design:type", String)
], AuthUserSchema.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: ['SUPER_ADMIN'], required: false }),
    __metadata("design:type", Array)
], AuthUserSchema.prototype, "roles", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'ALL', required: false }),
    __metadata("design:type", String)
], AuthUserSchema.prototype, "assignedWarehouseId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'EMPLOYEE', enum: ['EMPLOYEE', 'CUSTOMER'] }),
    __metadata("design:type", String)
], AuthUserSchema.prototype, "type", void 0);
class AuthResponseSchema {
}
exports.AuthResponseSchema = AuthResponseSchema;
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], AuthResponseSchema.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'eyJhbGciOiJIUzI1NiIsIn...' }),
    __metadata("design:type", String)
], AuthResponseSchema.prototype, "token", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Bearer' }),
    __metadata("design:type", String)
], AuthResponseSchema.prototype, "tokenType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '7d' }),
    __metadata("design:type", String)
], AuthResponseSchema.prototype, "expiresIn", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'EMPLOYEE' }),
    __metadata("design:type", String)
], AuthResponseSchema.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: AuthUserSchema }),
    __metadata("design:type", AuthUserSchema)
], AuthResponseSchema.prototype, "user", void 0);
//# sourceMappingURL=auth-response.schema.js.map