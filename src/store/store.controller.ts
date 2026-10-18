import { Controller, Get, Post, Body, UseGuards, Req, GoneException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtService } from '@nestjs/jwt';
import { StoreService } from './store.service';
import { UpdateFreshiozStoreDto } from './dto/store.dto';
import { StoreStateResponseDto } from './schemas/store.schema';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('Store')
@Controller('freshioz-store')
export class StoreController {
  constructor(
    private readonly storeService: StoreService,
    private readonly jwtService: JwtService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get live data store state (Public catalog for guests, full operations for staff)' })
  @ApiResponse({ status: 200, type: StoreStateResponseDto })
  async getStore(@Req() req: any) {
    let currentUser: any = null;
    const authHeader = req.headers?.['authorization'] || req.headers?.['Authorization'];
    if (authHeader && typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.split(' ')[1];
        currentUser = this.jwtService.verify(token);
      } catch (e) {
        currentUser = null;
      }
    }
    return this.storeService.getCombinedStore(currentUser);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'WAREHOUSE_MANAGER', 'WAREHOUSE_STAFF', 'PROCUREMENT_OFFICER', 'SALES_OFFICER', 'PRICING_MANAGER')
  @Post()
  @ApiOperation({ summary: 'Sync unified store update (Restricted to Internal Staff Employees)' })
  saveStore(@Req() req: any, @Body() dto: UpdateFreshiozStoreDto) {
    const blocked = process.env.STORE_BLOCKED_COLLECTIONS;
    if (blocked === '*' || process.env.DISABLE_STORE_SYNC === 'true') {
      throw new GoneException(
        'POST /freshioz-store has been permanently disabled. Clients must use dedicated REST endpoints (/orders, /inventory, /procurement, etc.) managed via React Query.',
      );
    }
    return this.storeService.saveStore(dto, req.user);
  }
}
