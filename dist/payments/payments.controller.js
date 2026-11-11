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
    async getFreshCoinsSettings() {
        return this.paymentsService.getFreshCoinsSettings();
    }
    async updateFreshCoinsSettings(req, body) {
        return this.paymentsService.updateFreshCoinsSettings(body, req.user);
    }
    async getDeliverySettings() {
        return this.paymentsService.getDeliverySettings();
    }
    async updateDeliverySettings(req, body) {
        return this.paymentsService.updateDeliverySettings(body, req.user);
    }
    async getFreshCoinsPublicConfig() {
        return this.paymentsService.getFreshCoinsPublicConfig();
    }
    async getMyFreshCoinsWallet(req) {
        return this.paymentsService.getCustomerFreshCoinsWallet(req.user);
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
    async generateOrderDynamicQr(id) {
        return this.paymentsService.createOrderDynamicQr(id);
    }
    async getOrderDynamicQr(id) {
        return this.paymentsService.createOrderDynamicQr(id);
    }
    async refundOrder(id, body) {
        return this.paymentsService.processOrderRefund(id, body?.amount, body?.reason);
    }
    async listDriverPayouts(req) {
        return this.paymentsService.listDriverPayouts(req.query, req.user);
    }
    async createDriverPayout(req, body) {
        return this.paymentsService.createDriverPayout(body, req.user);
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
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('SUPER_ADMIN'),
    (0, common_1.Get)('fresh-coins/settings'),
    (0, swagger_1.ApiOperation)({ summary: 'Get FreshCoins loyalty configuration (Super Admin only)' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "getFreshCoinsSettings", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('SUPER_ADMIN'),
    (0, common_1.Put)('fresh-coins/settings'),
    (0, swagger_1.ApiOperation)({ summary: 'Update FreshCoins loyalty configuration (Super Admin only)' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "updateFreshCoinsSettings", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('SUPER_ADMIN'),
    (0, common_1.Get)('delivery/settings'),
    (0, swagger_1.ApiOperation)({ summary: 'Get current delivery fee and free delivery thresholds (Super Admin only)' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "getDeliverySettings", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('SUPER_ADMIN'),
    (0, common_1.Put)('delivery/settings'),
    (0, swagger_1.ApiOperation)({ summary: 'Update delivery fee and free delivery thresholds (Super Admin only)' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "updateDeliverySettings", null);
__decorate([
    (0, common_1.Get)('fresh-coins/public-config'),
    (0, swagger_1.ApiOperation)({ summary: 'Public FreshCoins configuration for cart & checkout calculations' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "getFreshCoinsPublicConfig", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('fresh-coins/my-wallet'),
    (0, swagger_1.ApiOperation)({ summary: 'Get customer FreshCoins balance and ledger history' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "getMyFreshCoinsWallet", null);
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
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('orders/:id/dynamic-qr'),
    (0, swagger_1.ApiOperation)({ summary: 'Generate dynamic Razorpay/UPI QR code for doorstep COD order collection' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "generateOrderDynamicQr", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('orders/:id/dynamic-qr'),
    (0, swagger_1.ApiOperation)({ summary: 'Get dynamic Razorpay/UPI QR code for doorstep COD order collection' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "getOrderDynamicQr", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('SUPER_ADMIN', 'WAREHOUSE_MANAGER'),
    (0, common_1.Post)('orders/:id/refund'),
    (0, swagger_1.ApiOperation)({ summary: 'Initiate Razorpay gateway refund for an online paid order (Admin / Manager)' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "refundOrder", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('driver-payouts'),
    (0, swagger_1.ApiOperation)({ summary: 'List driver payout logs (Drivers get their own; Managers get warehouse/all)' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "listDriverPayouts", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('SUPER_ADMIN', 'WAREHOUSE_MANAGER'),
    (0, common_1.Post)('driver-payouts'),
    (0, swagger_1.ApiOperation)({ summary: 'Record settlement payout to delivery driver (Manager only)' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "createDriverPayout", null);
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