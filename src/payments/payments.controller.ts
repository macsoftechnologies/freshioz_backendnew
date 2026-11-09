import { Controller, Get, Post, Put, Body, Req, Headers, Param, UseGuards } from '@nestjs/common';
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

  // ==========================================
  // FRESHCOINS LOYALTY SETTINGS & WALLET
  // ==========================================
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  @Get('fresh-coins/settings')
  @ApiOperation({ summary: 'Get FreshCoins loyalty configuration (Super Admin only)' })
  async getFreshCoinsSettings() {
    return this.paymentsService.getFreshCoinsSettings();
  }

  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  @Put('fresh-coins/settings')
  @ApiOperation({ summary: 'Update FreshCoins loyalty configuration (Super Admin only)' })
  async updateFreshCoinsSettings(@Req() req: any, @Body() body: any) {
    return this.paymentsService.updateFreshCoinsSettings(body, req.user);
  }

  // ==========================================
  // DYNAMIC DELIVERY SETTINGS (ADMIN CONTROLLED)
  // ==========================================
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  @Get('delivery/settings')
  @ApiOperation({ summary: 'Get current delivery fee and free delivery thresholds (Super Admin only)' })
  async getDeliverySettings() {
    return this.paymentsService.getDeliverySettings();
  }

  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  @Put('delivery/settings')
  @ApiOperation({ summary: 'Update delivery fee and free delivery thresholds (Super Admin only)' })
  async updateDeliverySettings(@Req() req: any, @Body() body: any) {
    return this.paymentsService.updateDeliverySettings(body, req.user);
  }

  @Get('fresh-coins/public-config')
  @ApiOperation({ summary: 'Public FreshCoins configuration for cart & checkout calculations' })
  async getFreshCoinsPublicConfig() {
    return this.paymentsService.getFreshCoinsPublicConfig();
  }

  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Get('fresh-coins/my-wallet')
  @ApiOperation({ summary: 'Get customer FreshCoins balance and ledger history' })
  async getMyFreshCoinsWallet(@Req() req: any) {
    return this.paymentsService.getCustomerFreshCoinsWallet(req.user);
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

  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Post('orders/:id/dynamic-qr')
  @ApiOperation({ summary: 'Generate dynamic Razorpay/UPI QR code for doorstep COD order collection' })
  async generateOrderDynamicQr(@Param('id') id: string) {
    return this.paymentsService.createOrderDynamicQr(id);
  }

  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Get('orders/:id/dynamic-qr')
  @ApiOperation({ summary: 'Get dynamic Razorpay/UPI QR code for doorstep COD order collection' })
  async getOrderDynamicQr(@Param('id') id: string) {
    return this.paymentsService.createOrderDynamicQr(id);
  }

  // ==========================================
  // DRIVER / DELIVERY PARTNER PAYOUTS
  // ==========================================
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Get('driver-payouts')
  @ApiOperation({ summary: 'List driver payout logs (Drivers get their own; Managers get warehouse/all)' })
  async listDriverPayouts(@Req() req: any) {
    return this.paymentsService.listDriverPayouts(req.query, req.user);
  }

  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'WAREHOUSE_MANAGER')
  @Post('driver-payouts')
  @ApiOperation({ summary: 'Record settlement payout to delivery driver (Manager only)' })
  async createDriverPayout(@Req() req: any, @Body() body: any) {
    return this.paymentsService.createDriverPayout(body, req.user);
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
