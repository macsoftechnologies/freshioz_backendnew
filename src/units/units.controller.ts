import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { UnitsService } from './units.service';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('Packaging Units')
@Controller('units')
export class UnitsController {
  constructor(private readonly unitsService: UnitsService) {}

  @Get()
  @ApiOperation({ summary: 'List packaging units (Public: kg, crate, ton, pack)' })
  @ApiQuery({ name: 'status', required: false, enum: ['ACTIVE', 'INACTIVE'] })
  async findAll(@Query('status') status?: string) {
    return this.unitsService.findAll(status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get single packaging unit by ID' })
  async findOne(@Param('id') id: string) {
    return this.unitsService.findOne(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'PRICING_MANAGER', 'WAREHOUSE_MANAGER')
  @Post()
  @ApiOperation({ summary: 'Create new packaging unit (Admin only)' })
  async create(@Body() dto: CreateUnitDto) {
    return this.unitsService.create(dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'PRICING_MANAGER', 'WAREHOUSE_MANAGER')
  @Patch(':id')
  @ApiOperation({ summary: 'Update packaging unit specifications (Admin only)' })
  async update(@Param('id') id: string, @Body() dto: UpdateUnitDto) {
    return this.unitsService.update(id, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'PRICING_MANAGER', 'WAREHOUSE_MANAGER')
  @Delete(':id')
  @ApiOperation({ summary: 'Delete or deactivate packaging unit (Admin only)' })
  async remove(@Param('id') id: string) {
    return this.unitsService.remove(id);
  }
}
