import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtService } from '@nestjs/jwt';
import { WarehousesService } from './warehouses.service';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';
import { WarehouseSchema } from './schemas/warehouse.schema';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('Warehouses')
@Controller('warehouses')
export class WarehousesController {
  constructor(
    private readonly warehousesService: WarehousesService,
    private readonly jwtService: JwtService,
  ) {}

  @ApiOperation({ summary: 'List all fulfillment warehouse hubs' })
  @ApiResponse({ status: 200, type: [WarehouseSchema] })
  @Get()
  async findAll(@Req() req: any) {
    let isStaff = false;
    const authHeader = req?.headers?.['authorization'] || req?.headers?.['Authorization'];
    if (authHeader && typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
      try {
        const decoded: any = this.jwtService.verify(authHeader.split(' ')[1]);
        isStaff = Boolean(
          decoded &&
          (decoded.type === 'EMPLOYEE' ||
           decoded.role === 'SUPER_ADMIN' ||
           decoded.role === 'ADMIN' ||
           (Array.isArray(decoded.roles) && decoded.roles.some((r: string) => ['SUPER_ADMIN', 'WAREHOUSE_MANAGER', 'WAREHOUSE_STAFF', 'ADMIN', 'PROCUREMENT_OFFICER', 'SALES_OFFICER'].includes(r)))) &&
          !decoded.roles?.includes('SOCIETY_PARTNER')
        );
      } catch (e) {
        isStaff = false;
      }
    }
    return this.warehousesService.findAll(isStaff);
  }

  @ApiOperation({ summary: 'Get warehouse details by ID or Code' })
  @ApiResponse({ status: 200, type: WarehouseSchema })
  @Get(':id')
  async findOne(@Req() req: any, @Param('id') id: string) {
    let isStaff = false;
    const authHeader = req.headers?.['authorization'] || req.headers?.['Authorization'];
    if (authHeader && typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
      try {
        const decoded = this.jwtService.verify(authHeader.split(' ')[1]);
        isStaff = Boolean(
          decoded &&
          (decoded.type === 'EMPLOYEE' ||
           decoded.role === 'SUPER_ADMIN' ||
           decoded.role === 'ADMIN' ||
           (Array.isArray(decoded.roles) && decoded.roles.some((r: string) => ['SUPER_ADMIN', 'WAREHOUSE_MANAGER', 'WAREHOUSE_STAFF', 'ADMIN', 'PROCUREMENT_OFFICER', 'SALES_OFFICER'].includes(r)))) &&
          !decoded.roles?.includes('SOCIETY_PARTNER')
        );
      } catch (e) {}
    }
    return this.warehousesService.findOne(id, isStaff);
  }

  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  @ApiOperation({ summary: 'Create new fulfillment warehouse hub (Super Admin)' })
  @ApiResponse({ status: 201, type: WarehouseSchema })
  @Post()
  async create(@Body() body: CreateWarehouseDto) {
    return this.warehousesService.create(body);
  }

  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'WAREHOUSE_MANAGER')
  @ApiOperation({ summary: 'Update warehouse settings & cutoff times' })
  @ApiResponse({ status: 200, type: WarehouseSchema })
  @Put(':id')
  async updateWithParam(@Param('id') id: string, @Body() body: any) {
    return this.warehousesService.update(id, body);
  }

  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'WAREHOUSE_MANAGER')
  @Put()
  async update(@Body() body: UpdateWarehouseDto) {
    return this.warehousesService.update(body.id, body);
  }

  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  @ApiOperation({ summary: 'Delete a warehouse hub' })
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.warehousesService.delete(id);
  }
}
