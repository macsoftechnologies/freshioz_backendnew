import { Controller, Get, Post, Put, Patch, Body, Param, Query, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ReviewsService, CreateReviewDto, UpdateReviewDto } from './reviews.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @ApiOperation({ summary: 'Submit a product, delivery, or website review' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  async createReview(@Req() req: any, @Body() body: CreateReviewDto) {
    return this.reviewsService.createReview(req.user, body);
  }

  @ApiOperation({ summary: 'Edit my submitted review' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateReview(@Req() req: any, @Param('id') id: string, @Body() body: UpdateReviewDto) {
    return this.reviewsService.updateReview(id, req.user, body);
  }

  @ApiOperation({ summary: 'Get current customer submitted reviews' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('my')
  async getMyReviews(@Req() req: any) {
    return this.reviewsService.getCustomerReviews(req.user);
  }

  @ApiOperation({ summary: 'Public: Get approved reviews and overall rating for a product' })
  @Get('product/:productId')
  async getProductReviews(@Param('productId') productId: string) {
    return this.reviewsService.getProductReviewsPublic(productId);
  }

  @ApiOperation({ summary: 'Public: Get approved website reviews' })
  @Get('website')
  async getWebsiteReviews() {
    return this.reviewsService.getWebsiteReviewsPublic();
  }

  @ApiOperation({ summary: 'Staff: Get all reviews for moderation' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  @Get('admin')
  async getAdminReviews(
    @Query('type') type?: string,
    @Query('status') status?: string,
    @Query('flagged') flagged?: string,
  ) {
    return this.reviewsService.getAdminReviews({ type, status, flagged });
  }

  @ApiOperation({ summary: 'Staff: Approve, hide, or flag a review' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  @Patch('admin/:id/moderate')
  async moderateReview(
    @Req() req: any,
    @Param('id') id: string,
    @Body() body: { status: 'APPROVED' | 'HIDDEN'; flagged?: boolean },
  ) {
    return this.reviewsService.moderateReview(id, req.user, body.status, body.flagged);
  }
}
