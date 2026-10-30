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
exports.UpdatePaymentSettingsDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class UpdatePaymentSettingsDto {
}
exports.UpdatePaymentSettingsDto = UpdatePaymentSettingsDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdatePaymentSettingsDto.prototype, "razorpayEnabled", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'TEST', enum: ['TEST', 'LIVE'] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(['TEST', 'LIVE']),
    __metadata("design:type", String)
], UpdatePaymentSettingsDto.prototype, "activeMode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'rzp_test_1234567890abcdef' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdatePaymentSettingsDto.prototype, "testKeyId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'secret_key_testing_xyz' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdatePaymentSettingsDto.prototype, "testKeySecret", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'rzp_live_1234567890abcdef' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdatePaymentSettingsDto.prototype, "liveKeyId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'secret_key_production_xyz' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdatePaymentSettingsDto.prototype, "liveKeySecret", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'whsec_abcdef123456' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdatePaymentSettingsDto.prototype, "webhookSecret", void 0);
//# sourceMappingURL=update-payment-settings.dto.js.map