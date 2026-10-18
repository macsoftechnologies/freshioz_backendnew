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
exports.CustomerDiscountsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const customer_discounts_service_1 = require("./customer-discounts.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let CustomerDiscountsController = class CustomerDiscountsController {
    constructor(discountsService) {
        this.discountsService = discountsService;
    }
    async createDiscount(req, body) {
        return this.discountsService.createDiscount(req.user, body);
    }
    async getAdminDiscounts(status, userId) {
        return this.discountsService.getAdminDiscounts({ status, userId });
    }
    async revokeDiscount(req, id) {
        return this.discountsService.revokeDiscount(id, req.user);
    }
    async getMyDiscounts(req) {
        return this.discountsService.getCustomerDiscounts(req.user);
    }
    async validateDiscount(req, body) {
        return this.discountsService.validateDiscount(body.code, req.user, Number(body.cartSubtotal) || 0);
    }
};
exports.CustomerDiscountsController = CustomerDiscountsController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Admin: Award a feedback discount to a customer account' }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('admin'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CustomerDiscountsController.prototype, "createDiscount", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Admin: Get list of awarded discounts' }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('admin'),
    __param(0, (0, common_1.Query)('status')),
    __param(1, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CustomerDiscountsController.prototype, "getAdminDiscounts", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Admin: Revoke an unused discount' }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Patch)('admin/:id/revoke'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], CustomerDiscountsController.prototype, "revokeDiscount", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Customer: Get my active rewards and discounts' }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('my'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CustomerDiscountsController.prototype, "getMyDiscounts", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Customer: Validate and preview discount code for cart' }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('validate'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CustomerDiscountsController.prototype, "validateDiscount", null);
exports.CustomerDiscountsController = CustomerDiscountsController = __decorate([
    (0, swagger_1.ApiTags)('Customer Discounts'),
    (0, common_1.Controller)('customer-discounts'),
    __metadata("design:paramtypes", [customer_discounts_service_1.CustomerDiscountsService])
], CustomerDiscountsController);
//# sourceMappingURL=customer-discounts.controller.js.map