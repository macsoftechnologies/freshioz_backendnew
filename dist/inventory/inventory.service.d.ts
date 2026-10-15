import { PrismaService } from '../prisma/prisma.service';
import { AdjustStockDto } from './dto/adjust-stock.dto';
export declare class InventoryService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(warehouseId?: string): Promise<{
        id: string;
        warehouseId: string;
        warehouseName: string;
        productId: string;
        productName: string;
        currentQty: number;
        reservedQty: number;
        availableQty: number;
        unit: string;
        updatedAtFormatted: string;
    }[]>;
    adjustStock(dto: AdjustStockDto): Promise<{
        id: string;
        warehouseId: string;
        warehouseName: string;
        productId: string;
        productName: string;
        currentQty: number;
        reservedQty: number;
        availableQty: number;
        unit: string;
        updatedAtFormatted: string;
    }>;
}
