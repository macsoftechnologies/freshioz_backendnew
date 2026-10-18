import { Controller, Get, Post, Patch, Body, Param, Query, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CustomerDiscountsService, CreateCustomerDiscountDto } from './customer-discounts.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Customer Discounts')
@Controller('customer-discounts')
export class CustomerDiscountsController {
  constructor(private readonly discountsService: CustomerDiscountsService) {}

  @ApiOperation({ summary: 'Admin: Award a feedback discount to a customer account' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('admin')
  async createDiscount(@Req() req: any, @Body() body: CreateCustomerDiscountDto) {
    return this.discountsService.createDiscount(req.user, body);
  }

  @ApiOperation({ summary: 'Admin: Get list of awarded discounts' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('admin')
  async getAdminDiscounts(@Query('status') status?: string, @Query('userId') userId?: string) {
    return this.discountsService.getAdminDiscounts({ status, userId });
  }

  @ApiOperation({ summary: 'Admin: Revoke an unused discount' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch('admin/:id/revoke')
  async revokeDiscount(@Req() req: any, @Param('id') id: string) {
    return this.discountsService.revokeDiscount(id, req.user);
  }

  @ApiOperation({ summary: 'Customer: Get my active rewards and discounts' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('my')
  async getMyDiscounts(@Req() req: any) {
    return this.discountsService.getCustomerDiscounts(req.user);
  }

  @ApiOperation({ summary: 'Customer: Validate and preview discount code for cart' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('validate')
  async validateDiscount(@Req() req: any, @Body() body: { code: string; cartSubtotal: number }) {
    return this.discountsService.validateDiscount(body.code, req.user, Number(body.cartSubtotal) || 0);
  }
}
