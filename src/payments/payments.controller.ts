import { Controller, Get, Post, Put, Body, Req, Headers, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { UpdatePaymentSettingsDto } from './dto/update-payment-settings.dto';
import { CreateRazorpayOrderDto } from './dto/create-razorpay-order.dto';
import { VerifyRazorpayPaymentDto } from './dto/verify-razorpay-payment.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('Payments & Gateway Settings')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  @Get('settings')
  @ApiOperation({ summary: 'Get current payment gateway credentials & status (Super Admin only)' })
  async getSettings() {
    return this.paymentsService.getSettings();
  }

  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  @Put('settings')
  @ApiOperation({ summary: 'Update Razorpay API keys, mode (TEST/LIVE), and active toggle (Super Admin only)' })
  async updateSettings(@Req() req: any, @Body() body: UpdatePaymentSettingsDto) {
    return this.paymentsService.updateSettings(body, req.user);
  }

  @Get('razorpay/public-config')
  @ApiOperation({ summary: 'Get public payment gateway configuration for checkout (Client-safe, no secrets)' })
  async getPublicConfig() {
    return this.paymentsService.getPublicConfig();
  }

  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Post('razorpay/create-order')
  @ApiOperation({ summary: 'Create Razorpay payment order for customer basket' })
  async createRazorpayOrder(@Body() body: CreateRazorpayOrderDto) {
    return this.paymentsService.createRazorpayOrder(body);
  }

  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Post('razorpay/verify')
  @ApiOperation({ summary: 'Verify Razorpay cryptographic signature and commit confirmed order as PAID' })
  async verifyPayment(@Body() body: VerifyRazorpayPaymentDto) {
    return this.paymentsService.verifyAndCreateOrder(body);
  }

  @Post('razorpay/webhook')
  @ApiOperation({ summary: 'Asynchronous webhook receiver for Razorpay payment notifications' })
  async handleWebhook(
    @Body() body: any,
    @Headers('x-razorpay-signature') signature?: string,
  ) {
    return this.paymentsService.handleWebhook(body, signature || '');
  }
}
