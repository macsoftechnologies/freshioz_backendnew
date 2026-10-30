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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const payments_service_1 = require("./payments.service");
const update_payment_settings_dto_1 = require("./dto/update-payment-settings.dto");
const create_razorpay_order_dto_1 = require("./dto/create-razorpay-order.dto");
const verify_razorpay_payment_dto_1 = require("./dto/verify-razorpay-payment.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
let PaymentsController = class PaymentsController {
    constructor(paymentsService) {
        this.paymentsService = paymentsService;
    }
    async getSettings() {
        return this.paymentsService.getSettings();
    }
    async updateSettings(req, body) {
        return this.paymentsService.updateSettings(body, req.user);
    }
    async getPublicConfig() {
        return this.paymentsService.getPublicConfig();
    }
    async createRazorpayOrder(body) {
        return this.paymentsService.createRazorpayOrder(body);
    }
    async verifyPayment(body) {
        return this.paymentsService.verifyAndCreateOrder(body);
    }
    async handleWebhook(body, signature) {
        return this.paymentsService.handleWebhook(body, signature || '');
    }
};
exports.PaymentsController = PaymentsController;
__decorate([
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('SUPER_ADMIN'),
    (0, common_1.Get)('settings'),
    (0, swagger_1.ApiOperation)({ summary: 'Get current payment gateway credentials & status (Super Admin only)' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "getSettings", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('SUPER_ADMIN'),
    (0, common_1.Put)('settings'),
    (0, swagger_1.ApiOperation)({ summary: 'Update Razorpay API keys, mode (TEST/LIVE), and active toggle (Super Admin only)' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_payment_settings_dto_1.UpdatePaymentSettingsDto]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "updateSettings", null);
__decorate([
    (0, common_1.Get)('razorpay/public-config'),
    (0, swagger_1.ApiOperation)({ summary: 'Get public payment gateway configuration for checkout (Client-safe, no secrets)' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "getPublicConfig", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('razorpay/create-order'),
    (0, swagger_1.ApiOperation)({ summary: 'Create Razorpay payment order for customer basket' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_razorpay_order_dto_1.CreateRazorpayOrderDto]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "createRazorpayOrder", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('razorpay/verify'),
    (0, swagger_1.ApiOperation)({ summary: 'Verify Razorpay cryptographic signature and commit confirmed order as PAID' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [verify_razorpay_payment_dto_1.VerifyRazorpayPaymentDto]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "verifyPayment", null);
__decorate([
    (0, common_1.Post)('razorpay/webhook'),
    (0, swagger_1.ApiOperation)({ summary: 'Asynchronous webhook receiver for Razorpay payment notifications' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('x-razorpay-signature')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "handleWebhook", null);
exports.PaymentsController = PaymentsController = __decorate([
    (0, swagger_1.ApiTags)('Payments & Gateway Settings'),
    (0, common_1.Controller)('payments'),
    __metadata("design:paramtypes", [payments_service_1.PaymentsService])
], PaymentsController);
//# sourceMappingURL=payments.controller.js.map