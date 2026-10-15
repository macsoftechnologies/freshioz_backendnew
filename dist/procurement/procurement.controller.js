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
exports.ProcurementController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const procurement_service_1 = require("./procurement.service");
const create_procurement_bill_dto_1 = require("./dto/create-procurement-bill.dto");
const procurement_bill_schema_1 = require("./schemas/procurement-bill.schema");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
let ProcurementController = class ProcurementController {
    constructor(procurementService) {
        this.procurementService = procurementService;
    }
    findAll() {
        return this.procurementService.findAll();
    }
    findOne(id) {
        return this.procurementService.findOne(id);
    }
    create(dto) {
        return this.procurementService.create(dto);
    }
};
exports.ProcurementController = ProcurementController;
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('SUPER_ADMIN', 'PROCUREMENT_OFFICER', 'WAREHOUSE_MANAGER'),
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List all APMC Mandi procurement bills' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: [procurement_bill_schema_1.ProcurementBillResponseDto] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProcurementController.prototype, "findAll", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('SUPER_ADMIN', 'PROCUREMENT_OFFICER', 'WAREHOUSE_MANAGER'),
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get single procurement bill by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: procurement_bill_schema_1.ProcurementBillResponseDto }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProcurementController.prototype, "findOne", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('SUPER_ADMIN', 'PROCUREMENT_OFFICER'),
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new APMC procurement bill' }),
    (0, swagger_1.ApiResponse)({ status: 201, type: procurement_bill_schema_1.ProcurementBillResponseDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_procurement_bill_dto_1.CreateProcurementBillDto]),
    __metadata("design:returntype", void 0)
], ProcurementController.prototype, "create", null);
exports.ProcurementController = ProcurementController = __decorate([
    (0, swagger_1.ApiTags)('Procurement'),
    (0, common_1.Controller)('procurement'),
    __metadata("design:paramtypes", [procurement_service_1.ProcurementService])
], ProcurementController);
//# sourceMappingURL=procurement.controller.js.map