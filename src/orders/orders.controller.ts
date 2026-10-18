import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards, Req, ForbiddenException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order.dto';
import { OrderResponseDto } from './schemas/order.schema';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { JwtService } from '@nestjs/jwt';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly jwtService: JwtService,
  ) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'List orders with optional filters (Staff full access, Customer self-only, Partner society-only)' })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'societyId', required: false })
  @ApiQuery({ name: 'phone', required: false })
  @ApiQuery({ name: 'warehouseId', required: false })
  @ApiResponse({ status: 200, type: [OrderResponseDto] })
  findAll(
    @Req() req: any,
    @Query('status') status?: string,
    @Query('societyId') societyId?: string,
    @Query('phone') phone?: string,
    @Query('warehouseId') warehouseId?: string,
  ) {
    const user = req.user;
    // 1. Authenticated customer: strictly limit results to their own phone number
    if (user?.type === 'CUSTOMER') {
      return this.ordersService.findAll({ status, societyId, phone: user.phone, warehouseId });
    }
    // 2. Society Partner: strictly limit results to their own society
    if (user?.type === 'PARTNER' || user?.roles?.includes('SOCIETY_PARTNER')) {
      const partnerSocId = user.societyId || user.id;
      return this.ordersService.findAll({ status, societyId: partnerSocId, phone, warehouseId });
    }
    // 3. For internal staff: if user has an assigned warehouse and is not Super Admin, scope by warehouseId
    const isSuperAdmin = user?.roles?.includes('SUPER_ADMIN') || user?.role === 'SUPER_ADMIN';
    const staffWarehouseId = user?.assignedWarehouseId || user?.warehouseId;
    const effectiveWarehouseId = (!isSuperAdmin && staffWarehouseId && staffWarehouseId !== 'ALL') ? staffWarehouseId : warehouseId;

    return this.ordersService.findAll({ status, societyId, phone, warehouseId: effectiveWarehouseId });
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get single order details (Requires authentication; customer scoped to own order)' })
  @ApiResponse({ status: 200, type: OrderResponseDto })
  async findOne(@Req() req: any, @Param('id') id: string) {
    const order = await this.ordersService.findOne(id);
    const user = req.user;

    // Customer can only view their own order
    if (user?.type === 'CUSTOMER' && order.userPhone !== user.phone && order.userId !== user.id) {
      throw new ForbiddenException('Access denied. You can only view your own orders.');
    }

    // Society Partner can only view orders for their society
    if (user?.type === 'PARTNER' && user?.societyId && order.societyId !== user.societyId) {
      throw new ForbiddenException('Access denied. You can only view orders from your assigned society.');
    }

    // Warehouse staff can only view orders assigned to their warehouse
    const isSuperAdmin = user?.roles?.includes('SUPER_ADMIN') || user?.role === 'SUPER_ADMIN';
    if (!isSuperAdmin && user?.warehouseId && order.warehouseId && order.warehouseId !== user.warehouseId) {
      throw new ForbiddenException('Access denied. This order is assigned to another warehouse hub.');
    }

    return order;
  }

  @Get(':id/track')
  @ApiOperation({ summary: 'Public order tracking milestones for resident delivery map' })
  async trackOrder(@Req() req: any, @Param('id') id: string) {
    const order = await this.ordersService.findOne(id);

    // Verify if caller is authenticated staff or the customer who placed the order
    let isAuthorized = false;
    const authHeader = req.headers?.['authorization'] || req.headers?.['Authorization'];
    if (authHeader && typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
      try {
        const decoded = this.jwtService.verify(authHeader.split(' ')[1]);
        if (decoded?.type === 'EMPLOYEE' || decoded?.phone === order.userPhone || decoded?.id === order.userId) {
          isAuthorized = true;
        }
      } catch (e) {}
    }

    // Mask flat number for unauthenticated public tracking to protect resident privacy (e.g., "••••02")
    const maskedFlatNo = isAuthorized
      ? order.flatNo
      : order.flatNo
        ? order.flatNo.length > 2
          ? `••••${order.flatNo.slice(-2)}`
          : '••••'
        : null;

    // Return sanitized tracking-safe view (milestones, delivery slot, status)
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
    };
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create new customer order (Requires Customer or Admin authentication)' })
  @ApiResponse({ status: 201, type: OrderResponseDto })
  create(@Req() req: any, @Body() dto: CreateOrderDto) {
    const user = req.user;
    // Prevent customer phone spoofing: bind customer phone to authenticated JWT phone
    if (user?.type === 'CUSTOMER') {
      dto.userPhone = user.phone;
      if (user.name) dto.userName = user.name;
    }
    return this.ordersService.create(dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'WAREHOUSE_MANAGER', 'WAREHOUSE_STAFF', 'DELIVERY_EXECUTIVE')
  @Patch(':id/status')
  @ApiOperation({ summary: 'Update order status or COD payment info (Staff only)' })
  @ApiResponse({ status: 200, type: OrderResponseDto })
  updateStatus(@Param('id') id: string, @Body() dto: UpdateOrderStatusDto) {
    return this.ordersService.updateStatus(id, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':id/cancel')
  @ApiOperation({ summary: 'Cancel order (Customer authorized for pending orders; Staff authorized)' })
  @ApiResponse({ status: 200, type: OrderResponseDto })
  cancelOrder(@Req() req: any, @Param('id') id: string, @Body() body?: { reason?: string }) {
    return this.ordersService.cancelOrder(id, req.user, body?.reason);
  }
}
