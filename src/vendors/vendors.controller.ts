import { Controller, Get, Post, Put, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { VendorsService } from './vendors.service';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { VendorSchema } from './schemas/vendor.schema';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('APMC Mandi Vendors')
@Controller('vendors')
export class VendorsController {
  constructor(private readonly vendorsService: VendorsService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'PROCUREMENT_OFFICER', 'WAREHOUSE_MANAGER')
  @ApiOperation({ summary: 'List all registered Mandi commission agents & farm suppliers (Staff only)' })
  @ApiResponse({ status: 200, type: [VendorSchema] })
  @Get()
  async findAll() {
    return this.vendorsService.findAll();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'PROCUREMENT_OFFICER', 'WAREHOUSE_MANAGER')
  @ApiOperation({ summary: 'Get single registered Mandi vendor by ID (Staff only)' })
  @ApiResponse({ status: 200, type: VendorSchema })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.vendorsService.findOne(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'PROCUREMENT_OFFICER')
  @ApiOperation({ summary: 'Create new Mandi vendor with GPS map coordinates & bank settlement info' })
  @ApiResponse({ status: 201, type: VendorSchema })
  @Post()
  async create(@Body() body: CreateVendorDto) {
    return this.vendorsService.create(body);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'PROCUREMENT_OFFICER')
  @ApiOperation({ summary: 'Update vendor details or coordinates by param ID' })
  @ApiResponse({ status: 200, type: VendorSchema })
  @Put(':id')
  async updateWithParam(@Param('id') id: string, @Body() body: UpdateVendorDto) {
    return this.vendorsService.update(id, body);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'PROCUREMENT_OFFICER')
  @ApiOperation({ summary: 'Update vendor details or coordinates' })
  @ApiResponse({ status: 200, type: VendorSchema })
  @Put()
  async update(@Body() body: UpdateVendorDto) {
    return this.vendorsService.update(body.id, body);
  }
}
