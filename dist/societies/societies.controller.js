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
exports.SocietiesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const societies_service_1 = require("./societies.service");
const create_society_dto_1 = require("./dto/create-society.dto");
const update_society_dto_1 = require("./dto/update-society.dto");
const society_schema_1 = require("./schemas/society.schema");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
let SocietiesController = class SocietiesController {
    constructor(societiesService) {
        this.societiesService = societiesService;
    }
    async findAll() {
        return this.societiesService.findAll();
    }
    async listPayouts(req, societyId, status) {
        const user = req.user;
        if (user?.type === 'PARTNER' || user?.roles?.includes('SOCIETY_PARTNER')) {
            const partnerSocId = user.societyId || user.id;
            return this.societiesService.listPayouts({ societyId: partnerSocId, status });
        }
        return this.societiesService.listPayouts({ societyId, status });
    }
    async approvePayout(req, id, body) {
        return this.societiesService.approvePayout(id, req.user, body?.transactionRef);
    }
    async rejectPayout(req, id, body) {
        return this.societiesService.rejectPayout(id, req.user, body?.reason);
    }
    async findOne(id) {
        return this.societiesService.findOne(id);
    }
    async create(body) {
        return this.societiesService.create(body);
    }
    async updateWithParam(req, id, body) {
        return this.societiesService.update(id, body, req.user);
    }
    async update(req, body) {
        return this.societiesService.update(body.id, body, req.user);
    }
    async requestPayout(req, id, body) {
        const user = req.user;
        if (user?.type === 'PARTNER' && user?.societyId && user.societyId !== id) {
            throw new common_1.ForbiddenException('Access denied. You can only request payouts for your assigned society.');
        }
        return this.societiesService.requestPayout(id, body.amount);
    }
};
exports.SocietiesController = SocietiesController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'List all onboarded communities, apartments, and hostels' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: [society_schema_1.SocietySchema] }),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SocietiesController.prototype, "findAll", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'List society commission payout records (Admin all, Partner own society)' }),
    (0, swagger_1.ApiQuery)({ name: 'societyId', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false }),
    (0, common_1.Get)('payouts'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('societyId')),
    __param(2, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], SocietiesController.prototype, "listPayouts", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('SUPER_ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Approve society commission payout with UTR transaction ref (Super Admin only)' }),
    (0, common_1.Post)('payouts/:id/approve'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], SocietiesController.prototype, "approvePayout", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('SUPER_ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Reject payout request and refund balance back to society (Super Admin only)' }),
    (0, common_1.Post)('payouts/:id/reject'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], SocietiesController.prototype, "rejectPayout", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get single onboarded community by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: society_schema_1.SocietySchema }),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SocietiesController.prototype, "findOne", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('SUPER_ADMIN', 'SALES_OFFICER'),
    (0, swagger_1.ApiOperation)({ summary: 'Onboard a new community or hostel' }),
    (0, swagger_1.ApiResponse)({ status: 201, type: society_schema_1.SocietySchema }),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_society_dto_1.CreateSocietyDto]),
    __metadata("design:returntype", Promise)
], SocietiesController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('SUPER_ADMIN', 'SALES_OFFICER'),
    (0, swagger_1.ApiOperation)({ summary: 'Approve or update society settings & commission by param ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: society_schema_1.SocietySchema }),
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_society_dto_1.UpdateSocietyDto]),
    __metadata("design:returntype", Promise)
], SocietiesController.prototype, "updateWithParam", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('SUPER_ADMIN', 'SALES_OFFICER'),
    (0, swagger_1.ApiOperation)({ summary: 'Approve or update society settings & commission' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: society_schema_1.SocietySchema }),
    (0, common_1.Put)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_society_dto_1.UpdateSocietyDto]),
    __metadata("design:returntype", Promise)
], SocietiesController.prototype, "update", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('SOCIETY_PARTNER', 'SUPER_ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Request society commission payout / withdrawal (Partner or Admin)' }),
    (0, common_1.Post)(':id/payout-request'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], SocietiesController.prototype, "requestPayout", null);
exports.SocietiesController = SocietiesController = __decorate([
    (0, swagger_1.ApiTags)('Societies & Hostels'),
    (0, common_1.Controller)('societies'),
    __metadata("design:paramtypes", [societies_service_1.SocietiesService])
], SocietiesController);
//# sourceMappingURL=societies.controller.js.map