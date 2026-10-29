import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
export declare class CategoriesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(status?: string): Promise<({
        _count: {
            products: number;
        };
    } & {
        id: string;
        name: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        slug: string;
        icon: string;
        sortOrder: number;
    })[]>;
    findOne(idOrSlug: string): Promise<{
        products: {
            id: string;
            uuid: string;
            name: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            tags: string[];
            kannadaName: string | null;
            categoryId: string;
            retailUnit: string;
            retailPrice: number;
            retailMarketPrice: number;
            bulkMinQty: number;
            bulkDiscountPercent: number;
            origin: string | null;
            shelfLife: string | null;
            desc: string | null;
            image: string;
            badge: string | null;
            gstPercent: number;
            inStock: boolean;
        }[];
    } & {
        id: string;
        name: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        slug: string;
        icon: string;
        sortOrder: number;
    }>;
    create(dto: CreateCategoryDto): Promise<{
        id: string;
        name: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        slug: string;
        icon: string;
        sortOrder: number;
    }>;
    update(id: string, dto: UpdateCategoryDto): Promise<{
        id: string;
        name: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        slug: string;
        icon: string;
        sortOrder: number;
    }>;
    remove(id: string): Promise<{
        id: string;
        name: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        slug: string;
        icon: string;
        sortOrder: number;
    }>;
}
