import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { CatalogService } from './catalog.service';

@ApiTags('Catalog')
@Controller('catalog')
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @ApiOperation({ summary: 'Get public read-only catalog (allow-listed without PII or banking fields)' })
  @ApiResponse({ status: 200, description: 'Public catalog retrieved successfully' })
  @ApiQuery({ name: 'date', required: false, description: 'Target delivery date (YYYY-MM-DD)' })
  @Get()
  async getPublicCatalog(@Query('date') date?: string) {
    return this.catalogService.getPublicCatalog(date);
  }
}
