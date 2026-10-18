import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
export declare class CategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    findAll(status?: string): Promise<({
        _count: {
            products: number;
        };
    } & {
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        slug: string;
        icon: string;
        sortOrder: number;
    })[]>;
    findOne(idOrSlug: string): Promise<{
        products: {
            id: string;
            uuid: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            desc: string | null;
            name: string;
            bulkDiscountPercent: number;
            tags: string[];
            kannadaName: string | null;
            categoryId: string;
            retailUnit: string;
            retailPrice: number;
            retailMarketPrice: number;
            bulkMinQty: number;
            origin: string | null;
            shelfLife: string | null;
            image: string;
            badge: string | null;
            gstPercent: number;
            inStock: boolean;
        }[];
    } & {
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        slug: string;
        icon: string;
        sortOrder: number;
    }>;
    create(dto: CreateCategoryDto): Promise<{
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        slug: string;
        icon: string;
        sortOrder: number;
    }>;
    update(id: string, dto: UpdateCategoryDto): Promise<{
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        slug: string;
        icon: string;
        sortOrder: number;
    }>;
    remove(id: string): Promise<{
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        slug: string;
        icon: string;
        sortOrder: number;
    }>;
}
