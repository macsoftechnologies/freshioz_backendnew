import { Controller, Get, Post, Body, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { InventoryService } from './inventory.service';
import { AdjustStockDto } from './dto/adjust-stock.dto';
import { InventoryItemResponseDto } from './schemas/inventory.schema';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('Inventory')
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'WAREHOUSE_MANAGER', 'WAREHOUSE_STAFF', 'DELIVERY_EXECUTIVE', 'PROCUREMENT_OFFICER')
  @Get()
  @ApiOperation({ summary: 'Get current inventory across warehouses' })
  @ApiQuery({ name: 'warehouseId', required: false, description: 'Filter by specific warehouse' })
  @ApiResponse({ status: 200, type: [InventoryItemResponseDto] })
  findAll(@Req() req: any, @Query('warehouseId') warehouseId?: string) {
    const user = req.user;
    const isSuperAdmin = user?.roles?.includes('SUPER_ADMIN') || user?.role === 'SUPER_ADMIN';
    const staffWarehouseId = user?.assignedWarehouseId || user?.warehouseId;
    const effectiveWarehouseId = !isSuperAdmin ? (staffWarehouseId || warehouseId) : warehouseId;
    return this.inventoryService.findAll(effectiveWarehouseId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'WAREHOUSE_MANAGER')
  @Post('adjust')
  @ApiOperation({ summary: 'Adjust or set stock level for a product in warehouse' })
  @ApiResponse({ status: 200, type: InventoryItemResponseDto })
  adjustStock(@Body() dto: AdjustStockDto) {
    return this.inventoryService.adjustStock(dto);
  }
}
