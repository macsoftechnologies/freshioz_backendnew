import { InventoryService } from './inventory.service';
import { AdjustStockDto } from './dto/adjust-stock.dto';
export declare class InventoryController {
    private readonly inventoryService;
    constructor(inventoryService: InventoryService);
    findAll(warehouseId?: string): Promise<{
        id: string;
        warehouseId: string;
        warehouseName: string;
        productId: string;
        productName: string;
        currentQty: number;
        quantity: number;
        stockQty: number;
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
