import { UnitsService } from './units.service';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';
export declare class UnitsController {
    private readonly unitsService;
    constructor(unitsService: UnitsService);
    findAll(status?: string): Promise<{
        id: string;
        name: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        label: string;
        isBulk: boolean;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        name: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        label: string;
        isBulk: boolean;
    }>;
    create(dto: CreateUnitDto): Promise<{
        id: string;
        name: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        label: string;
        isBulk: boolean;
    }>;
    update(id: string, dto: UpdateUnitDto): Promise<{
        id: string;
        name: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        label: string;
        isBulk: boolean;
    }>;
    remove(id: string): Promise<{
        id: string;
        name: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        label: string;
        isBulk: boolean;
    }>;
}
