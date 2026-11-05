import { Controller, Get, Post, Delete, Body, Param, UseGuards, Req, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ProcurementService } from './procurement.service';
import { CreateProcurementBillDto } from './dto/create-procurement-bill.dto';
import { ProcurementBillResponseDto } from './schemas/procurement-bill.schema';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('Procurement')
@Controller('procurement')
export class ProcurementController {
  constructor(private readonly procurementService: ProcurementService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'PROCUREMENT_OFFICER', 'WAREHOUSE_MANAGER')
  @Get()
  @ApiOperation({ summary: 'List all APMC Mandi procurement bills' })
  @ApiQuery({ name: 'warehouseId', required: false })
  @ApiResponse({ status: 200, type: [ProcurementBillResponseDto] })
  findAll(@Req() req: any, @Query('warehouseId') warehouseId?: string) {
    const user = req.user;
    const isSuperAdmin = user?.roles?.includes('SUPER_ADMIN') || user?.role === 'SUPER_ADMIN';
    const staffWarehouseId = user?.assignedWarehouseId || user?.warehouseId;
    const effectiveWarehouseId = !isSuperAdmin ? (staffWarehouseId || warehouseId) : warehouseId;
    return this.procurementService.findAll(effectiveWarehouseId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'PROCUREMENT_OFFICER', 'WAREHOUSE_MANAGER')
  @Get(':id')
  @ApiOperation({ summary: 'Get single procurement bill by ID' })
  @ApiResponse({ status: 200, type: ProcurementBillResponseDto })
  findOne(@Param('id') id: string) {
    return this.procurementService.findOne(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'PROCUREMENT_OFFICER', 'WAREHOUSE_MANAGER')
  @Post()
  @ApiOperation({ summary: 'Create a new APMC procurement bill' })
  @ApiResponse({ status: 201, type: ProcurementBillResponseDto })
  create(@Body() dto: CreateProcurementBillDto) {
    return this.procurementService.create(dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'PROCUREMENT_OFFICER')
  @Delete(':id')
  @ApiOperation({ summary: 'Delete procurement bill' })
  delete(@Param('id') id: string) {
    return this.procurementService.delete(id);
  }
}
