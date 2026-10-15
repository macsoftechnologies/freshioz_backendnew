import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductSchema } from './schemas/product.schema';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @ApiOperation({ summary: 'List all master products with category taxonomy' })
  @ApiResponse({ status: 200, type: [ProductSchema] })
  @Get()
  async findAll() {
    return this.productsService.findAll();
  }

  @ApiOperation({ summary: 'Get single master product by ID' })
  @ApiResponse({ status: 200, type: ProductSchema })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'PRICING_MANAGER', 'WAREHOUSE_MANAGER')
  @ApiOperation({ summary: 'Create master produce item' })
  @ApiResponse({ status: 201, type: ProductSchema })
  @Post()
  async create(@Body() body: CreateProductDto) {
    return this.productsService.create(body);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'PRICING_MANAGER', 'WAREHOUSE_MANAGER')
  @ApiOperation({ summary: 'Update master produce item specifications by param ID' })
  @ApiResponse({ status: 200, type: ProductSchema })
  @Put(':id')
  async updateWithParam(@Param('id') id: string, @Body() body: UpdateProductDto) {
    return this.productsService.update(id, body);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'PRICING_MANAGER', 'WAREHOUSE_MANAGER')
  @ApiOperation({ summary: 'Update master produce item specifications' })
  @ApiResponse({ status: 200, type: ProductSchema })
  @Put()
  async update(@Body() body: UpdateProductDto) {
    return this.productsService.update(body.id, body);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  @ApiOperation({ summary: 'Delete master produce item by ID' })
  @ApiResponse({ status: 200 })
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.productsService.delete(id);
  }
}

