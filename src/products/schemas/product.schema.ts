import { ApiProperty } from '@nestjs/swagger';

export class CategorySchema {
  @ApiProperty({ example: 'VEGETABLES' })
  id!: string;

  @ApiProperty({ example: 'Fresh Vegetables' })
  name!: string;

  @ApiProperty({ example: 'vegetables' })
  slug!: string;

  @ApiProperty({ example: '🥦' })
  icon!: string;
}

export class ProductSchema {
  @ApiProperty({ example: 'FRZ_PRD_101' })
  id!: string;

  @ApiProperty({ example: 'Country Tomatoes (Nati Tomato)' })
  name!: string;

  @ApiProperty({ example: 'ನಾಟಿ ಟೊಮೆಟೊ', required: false })
  kannadaName?: string;

  @ApiProperty({ example: 'VEGETABLES' })
  categoryId!: string;

  @ApiProperty({ type: CategorySchema, required: false })
  category?: CategorySchema;

  @ApiProperty({ example: '1 kg' })
  retailUnit!: string;

  @ApiProperty({ example: 32 })
  retailPrice!: number;

  @ApiProperty({ example: 45 })
  retailMarketPrice!: number;

  @ApiProperty({ example: 5 })
  bulkMinQty!: number;

  @ApiProperty({ example: 10 })
  bulkDiscountPercent!: number;

  @ApiProperty({ example: 'Kolar APMC Mandi', required: false })
  origin?: string;

  @ApiProperty({ example: '4-5 Days', required: false })
  shelfLife?: string;

  @ApiProperty({ example: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400' })
  image!: string;

  @ApiProperty({ example: 'Harvested Today at Dawn', required: false })
  badge?: string;

  @ApiProperty({ example: ['Salads', 'Curry Essential'] })
  tags!: string[];

  @ApiProperty({ example: 'ACTIVE' })
  status!: string;

  @ApiProperty({ example: true })
  inStock!: boolean;
}
