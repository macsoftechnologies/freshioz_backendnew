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
exports.InboundRequestsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const inbound_requests_service_1 = require("./inbound-requests.service");
const create_lead_dto_1 = require("./dto/create-lead.dto");
const update_lead_dto_1 = require("./dto/update-lead.dto");
const lead_schema_1 = require("./schemas/lead.schema");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
let InboundRequestsController = class InboundRequestsController {
    constructor(inboundRequestsService) {
        this.inboundRequestsService = inboundRequestsService;
    }
    async findAll() {
        return this.inboundRequestsService.findAll();
    }
    async create(body) {
        return this.inboundRequestsService.create(body);
    }
    async updateStatus(body) {
        return this.inboundRequestsService.updateStatus(body.id, body.status);
    }
};
exports.InboundRequestsController = InboundRequestsController;
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('SUPER_ADMIN', 'SALES_OFFICER'),
    (0, swagger_1.ApiOperation)({ summary: 'List all community onboarding leads with unread badge counter (Sales/Admin only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: lead_schema_1.InboundLeadsResponseSchema }),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InboundRequestsController.prototype, "findAll", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Submit new community onboarding request (Public from User Web)' }),
    (0, swagger_1.ApiResponse)({ status: 201, type: lead_schema_1.LeadSchema }),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_lead_dto_1.CreateLeadDto]),
    __metadata("design:returntype", Promise)
], InboundRequestsController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('SUPER_ADMIN', 'SALES_OFFICER'),
    (0, swagger_1.ApiOperation)({ summary: 'Update lead status (Salesperson verifies/onboards/drops)' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: lead_schema_1.LeadSchema }),
    (0, common_1.Patch)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_lead_dto_1.UpdateLeadDto]),
    __metadata("design:returntype", Promise)
], InboundRequestsController.prototype, "updateStatus", null);
exports.InboundRequestsController = InboundRequestsController = __decorate([
    (0, swagger_1.ApiTags)('Inbound Resident Requests'),
    (0, common_1.Controller)('inbound-requests'),
    __metadata("design:paramtypes", [inbound_requests_service_1.InboundRequestsService])
], InboundRequestsController);
//# sourceMappingURL=inbound-requests.controller.js.map