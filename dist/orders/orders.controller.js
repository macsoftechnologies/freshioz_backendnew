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
exports.OrdersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const orders_service_1 = require("./orders.service");
const create_order_dto_1 = require("./dto/create-order.dto");
const update_order_dto_1 = require("./dto/update-order.dto");
const order_schema_1 = require("./schemas/order.schema");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const jwt_1 = require("@nestjs/jwt");
let OrdersController = class OrdersController {
    constructor(ordersService, jwtService) {
        this.ordersService = ordersService;
        this.jwtService = jwtService;
    }
    findAll(req, status, societyId, phone, warehouseId) {
        const user = req.user;
        if (user?.type === 'CUSTOMER') {
            return this.ordersService.findAll({ status, societyId, phone: user.phone, warehouseId });
        }
        if (user?.type === 'PARTNER' || user?.roles?.includes('SOCIETY_PARTNER')) {
            const partnerSocId = user.societyId || user.id;
            return this.ordersService.findAll({ status, societyId: partnerSocId, phone, warehouseId });
        }
        const isSuperAdmin = user?.roles?.includes('SUPER_ADMIN') || user?.role === 'SUPER_ADMIN';
        const staffWarehouseId = user?.assignedWarehouseId || user?.warehouseId;
        const effectiveWarehouseId = (!isSuperAdmin && staffWarehouseId && staffWarehouseId !== 'ALL') ? staffWarehouseId : warehouseId;
        return this.ordersService.findAll({ status, societyId, phone, warehouseId: effectiveWarehouseId });
    }
    async findOne(req, id) {
        const order = await this.ordersService.findOne(id);
        const user = req.user;
        if (user?.type === 'CUSTOMER' && order.userPhone !== user.phone && order.userId !== user.id) {
            throw new common_1.ForbiddenException('Access denied. You can only view your own orders.');
        }
        if (user?.type === 'PARTNER' && user?.societyId && order.societyId !== user.societyId) {
            throw new common_1.ForbiddenException('Access denied. You can only view orders from your assigned society.');
        }
        const isSuperAdmin = user?.roles?.includes('SUPER_ADMIN') || user?.role === 'SUPER_ADMIN';
        if (!isSuperAdmin && user?.warehouseId && order.warehouseId && order.warehouseId !== user.warehouseId) {
            throw new common_1.ForbiddenException('Access denied. This order is assigned to another warehouse hub.');
        }
        return order;
    }
    async trackOrder(req, id) {
        const order = await this.ordersService.findOne(id);
        let isAuthorized = false;
        const authHeader = req.headers?.['authorization'] || req.headers?.['Authorization'];
        if (authHeader && typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
            try {
                const decoded = this.jwtService.verify(authHeader.split(' ')[1]);
                if (decoded?.type === 'EMPLOYEE' || decoded?.phone === order.userPhone || decoded?.id === order.userId) {
                    isAuthorized = true;
                }
            }
            catch (e) { }
        }
        const maskedFlatNo = isAuthorized
            ? order.flatNo
            : order.flatNo
                ? order.flatNo.length > 2
                    ? `••••${order.flatNo.slice(-2)}`
                    : '••••'
                : null;
        return {
            id: order.id,
            uuid: order.uuid,
            societyName: order.societyName,
            flatNo: maskedFlatNo,
            status: order.status,
            deliveryDate: order.deliveryDate,
            deliverySlot: order.deliverySlot,
            orderPlacedAt: order.orderPlacedAt,
            deliveredAt: order.deliveredAt,
            itemsCount: order.items?.length || 0,
            totalAmount: order.totalAmount,
            subtotal: order.subtotal,
            bulkSavings: order.bulkSavings,
            deliveryFee: order.deliveryFee,
            gstAmount: order.gstAmount,
            paymentMethod: order.paymentMethod,
            paymentStatus: order.paymentStatus,
            codCollectedAmount: order.codCollectedAmount,
            cancelledReason: order.cancelledReason,
            cancelledAt: order.cancelledAt,
            items: (order.items || []).map(i => ({
                id: i.id,
                productId: i.productId,
                name: i.name,
                unit: i.unit,
                qty: i.qty,
                price: i.price,
                effectivePrice: i.effectivePrice,
                totalPrice: i.totalPrice,
                isBulkApplied: i.isBulkApplied,
                bulkDiscountPercent: i.bulkDiscountPercent,
                bulkSavings: i.bulkSavings,
            })),
        };
    }
    create(req, dto) {
        const user = req.user;
        if (user?.type === 'CUSTOMER') {
            dto.userPhone = user.phone;
            if (user.name)
                dto.userName = user.name;
        }
        return this.ordersService.create(dto);
    }
    updateStatus(id, dto) {
        return this.ordersService.updateStatus(id, dto);
    }
    cancelOrder(req, id, body) {
        return this.ordersService.cancelOrder(id, req.user, body?.reason);
    }
};
exports.OrdersController = OrdersController;
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List orders with optional filters (Staff full access, Customer self-only, Partner society-only)' }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'societyId', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'phone', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'warehouseId', required: false }),
    (0, swagger_1.ApiResponse)({ status: 200, type: [order_schema_1.OrderResponseDto] }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('status')),
    __param(2, (0, common_1.Query)('societyId')),
    __param(3, (0, common_1.Query)('phone')),
    __param(4, (0, common_1.Query)('warehouseId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, String]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "findAll", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get single order details (Requires authentication; customer scoped to own order)' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: order_schema_1.OrderResponseDto }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':id/track'),
    (0, swagger_1.ApiOperation)({ summary: 'Public order tracking milestones for resident delivery map' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "trackOrder", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create new customer order (Requires Customer or Admin authentication)' }),
    (0, swagger_1.ApiResponse)({ status: 201, type: order_schema_1.OrderResponseDto }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_order_dto_1.CreateOrderDto]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('SUPER_ADMIN', 'WAREHOUSE_MANAGER', 'WAREHOUSE_STAFF', 'DELIVERY_EXECUTIVE'),
    (0, common_1.Patch)(':id/status'),
    (0, swagger_1.ApiOperation)({ summary: 'Update order status or COD payment info (Staff only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: order_schema_1.OrderResponseDto }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_order_dto_1.UpdateOrderStatusDto]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "updateStatus", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(':id/cancel'),
    (0, swagger_1.ApiOperation)({ summary: 'Cancel order (Customer authorized for pending orders; Staff authorized)' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: order_schema_1.OrderResponseDto }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "cancelOrder", null);
exports.OrdersController = OrdersController = __decorate([
    (0, swagger_1.ApiTags)('Orders'),
    (0, common_1.Controller)('orders'),
    __metadata("design:paramtypes", [orders_service_1.OrdersService,
        jwt_1.JwtService])
], OrdersController);
//# sourceMappingURL=orders.controller.js.map