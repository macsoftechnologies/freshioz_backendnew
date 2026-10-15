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
exports.VendorsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const vendors_service_1 = require("./vendors.service");
const create_vendor_dto_1 = require("./dto/create-vendor.dto");
const update_vendor_dto_1 = require("./dto/update-vendor.dto");
const vendor_schema_1 = require("./schemas/vendor.schema");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
let VendorsController = class VendorsController {
    constructor(vendorsService) {
        this.vendorsService = vendorsService;
    }
    async findAll() {
        return this.vendorsService.findAll();
    }
    async findOne(id) {
        return this.vendorsService.findOne(id);
    }
    async create(body) {
        return this.vendorsService.create(body);
    }
    async updateWithParam(id, body) {
        return this.vendorsService.update(id, body);
    }
    async update(body) {
        return this.vendorsService.update(body.id, body);
    }
};
exports.VendorsController = VendorsController;
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('SUPER_ADMIN', 'PROCUREMENT_OFFICER', 'WAREHOUSE_MANAGER'),
    (0, swagger_1.ApiOperation)({ summary: 'List all registered Mandi commission agents & farm suppliers (Staff only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: [vendor_schema_1.VendorSchema] }),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], VendorsController.prototype, "findAll", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('SUPER_ADMIN', 'PROCUREMENT_OFFICER', 'WAREHOUSE_MANAGER'),
    (0, swagger_1.ApiOperation)({ summary: 'Get single registered Mandi vendor by ID (Staff only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: vendor_schema_1.VendorSchema }),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VendorsController.prototype, "findOne", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('SUPER_ADMIN', 'PROCUREMENT_OFFICER'),
    (0, swagger_1.ApiOperation)({ summary: 'Create new Mandi vendor with GPS map coordinates & bank settlement info' }),
    (0, swagger_1.ApiResponse)({ status: 201, type: vendor_schema_1.VendorSchema }),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_vendor_dto_1.CreateVendorDto]),
    __metadata("design:returntype", Promise)
], VendorsController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('SUPER_ADMIN', 'PROCUREMENT_OFFICER'),
    (0, swagger_1.ApiOperation)({ summary: 'Update vendor details or coordinates by param ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: vendor_schema_1.VendorSchema }),
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_vendor_dto_1.UpdateVendorDto]),
    __metadata("design:returntype", Promise)
], VendorsController.prototype, "updateWithParam", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('SUPER_ADMIN', 'PROCUREMENT_OFFICER'),
    (0, swagger_1.ApiOperation)({ summary: 'Update vendor details or coordinates' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: vendor_schema_1.VendorSchema }),
    (0, common_1.Put)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_vendor_dto_1.UpdateVendorDto]),
    __metadata("design:returntype", Promise)
], VendorsController.prototype, "update", null);
exports.VendorsController = VendorsController = __decorate([
    (0, swagger_1.ApiTags)('APMC Mandi Vendors'),
    (0, common_1.Controller)('vendors'),
    __metadata("design:paramtypes", [vendors_service_1.VendorsService])
], VendorsController);
//# sourceMappingURL=vendors.controller.js.map