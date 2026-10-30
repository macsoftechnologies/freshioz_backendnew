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
exports.VerifyRazorpayPaymentDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const create_order_dto_1 = require("../../orders/dto/create-order.dto");
class VerifyRazorpayPaymentDto {
}
exports.VerifyRazorpayPaymentDto = VerifyRazorpayPaymentDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'order_DBJOWzybf0sJbb' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], VerifyRazorpayPaymentDto.prototype, "razorpayOrderId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'pay_DBJPHBmErOX5QC' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], VerifyRazorpayPaymentDto.prototype, "razorpayPaymentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '9a918a09f874288b698ab...' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], VerifyRazorpayPaymentDto.prototype, "razorpaySignature", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: create_order_dto_1.CreateOrderDto }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => create_order_dto_1.CreateOrderDto),
    __metadata("design:type", create_order_dto_1.CreateOrderDto)
], VerifyRazorpayPaymentDto.prototype, "orderPayload", void 0);
//# sourceMappingURL=verify-razorpay-payment.dto.js.map