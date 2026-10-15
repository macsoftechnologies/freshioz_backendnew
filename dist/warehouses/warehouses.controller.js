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
exports.WarehousesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_1 = require("@nestjs/jwt");
const warehouses_service_1 = require("./warehouses.service");
const create_warehouse_dto_1 = require("./dto/create-warehouse.dto");
const update_warehouse_dto_1 = require("./dto/update-warehouse.dto");
const warehouse_schema_1 = require("./schemas/warehouse.schema");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
let WarehousesController = class WarehousesController {
    constructor(warehousesService, jwtService) {
        this.warehousesService = warehousesService;
        this.jwtService = jwtService;
    }
    async findAll() {
        return this.warehousesService.findAll();
    }
    async findOne(req, id) {
        let isStaff = false;
        const authHeader = req.headers?.['authorization'] || req.headers?.['Authorization'];
        if (authHeader && typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
            try {
                const decoded = this.jwtService.verify(authHeader.split(' ')[1]);
                isStaff = decoded?.type === 'EMPLOYEE';
            }
            catch (e) { }
        }
        return this.warehousesService.findOne(id, isStaff);
    }
    async create(body) {
        return this.warehousesService.create(body);
    }
    async updateWithParam(id, body) {
        return this.warehousesService.update(id, body);
    }
    async update(body) {
        return this.warehousesService.update(body.id, body);
    }
    async delete(id) {
        return this.warehousesService.delete(id);
    }
};
exports.WarehousesController = WarehousesController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'List all fulfillment warehouse hubs' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: [warehouse_schema_1.WarehouseSchema] }),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], WarehousesController.prototype, "findAll", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get warehouse details by ID or Code' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: warehouse_schema_1.WarehouseSchema }),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], WarehousesController.prototype, "findOne", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('SUPER_ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Create new fulfillment warehouse hub (Super Admin)' }),
    (0, swagger_1.ApiResponse)({ status: 201, type: warehouse_schema_1.WarehouseSchema }),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_warehouse_dto_1.CreateWarehouseDto]),
    __metadata("design:returntype", Promise)
], WarehousesController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('SUPER_ADMIN', 'WAREHOUSE_MANAGER'),
    (0, swagger_1.ApiOperation)({ summary: 'Update warehouse settings & cutoff times' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: warehouse_schema_1.WarehouseSchema }),
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], WarehousesController.prototype, "updateWithParam", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('SUPER_ADMIN', 'WAREHOUSE_MANAGER'),
    (0, common_1.Put)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_warehouse_dto_1.UpdateWarehouseDto]),
    __metadata("design:returntype", Promise)
], WarehousesController.prototype, "update", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('SUPER_ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a warehouse hub' }),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WarehousesController.prototype, "delete", null);
exports.WarehousesController = WarehousesController = __decorate([
    (0, swagger_1.ApiTags)('Warehouses'),
    (0, common_1.Controller)('warehouses'),
    __metadata("design:paramtypes", [warehouses_service_1.WarehousesService,
        jwt_1.JwtService])
], WarehousesController);
//# sourceMappingURL=warehouses.controller.js.map