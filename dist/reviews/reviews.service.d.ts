import { PrismaService } from '../prisma/prisma.service';
export interface CreateReviewDto {
    type: 'PRODUCT' | 'DELIVERY' | 'WEBSITE';
    rating: number;
    comment?: string;
    orderId?: string;
    productId?: string;
}
export interface UpdateReviewDto {
    rating?: number;
    comment?: string;
}
export declare class ReviewsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createReview(user: any, dto: CreateReviewDto): Promise<{
        type: string;
        id: string;
        uuid: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        orderId: string | null;
        productId: string | null;
        productName: string | null;
        userPhone: string;
        userName: string;
        userId: string;
        rating: number;
        comment: string | null;
        flagged: boolean;
        moderatedById: string | null;
        moderatedAt: Date | null;
    }>;
    updateReview(id: string, user: any, dto: UpdateReviewDto): Promise<{
        type: string;
        id: string;
        uuid: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        orderId: string | null;
        productId: string | null;
        productName: string | null;
        userPhone: string;
        userName: string;
        userId: string;
        rating: number;
        comment: string | null;
        flagged: boolean;
        moderatedById: string | null;
        moderatedAt: Date | null;
    }>;
    getProductReviewsPublic(productId: string): Promise<{
        productId: string;
        averageRating: number;
        totalReviews: number;
        reviews: {
            id: string;
            createdAt: Date;
            userName: string;
            rating: number;
            comment: string;
        }[];
    }>;
    getWebsiteReviewsPublic(): Promise<{
        id: string;
        createdAt: Date;
        userName: string;
        rating: number;
        comment: string;
    }[]>;
    getCustomerReviews(user: any): Promise<{
        type: string;
        id: string;
        uuid: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        orderId: string | null;
        productId: string | null;
        productName: string | null;
        userPhone: string;
        userName: string;
        userId: string;
        rating: number;
        comment: string | null;
        flagged: boolean;
        moderatedById: string | null;
        moderatedAt: Date | null;
    }[]>;
    getAdminReviews(query?: {
        type?: string;
        status?: string;
        flagged?: string;
    }): Promise<{
        type: string;
        id: string;
        uuid: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        orderId: string | null;
        productId: string | null;
        productName: string | null;
        userPhone: string;
        userName: string;
        userId: string;
        rating: number;
        comment: string | null;
        flagged: boolean;
        moderatedById: string | null;
        moderatedAt: Date | null;
    }[]>;
    moderateReview(id: string, staffUser: any, status: 'APPROVED' | 'HIDDEN', flagged?: boolean): Promise<{
        type: string;
        id: string;
        uuid: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        orderId: string | null;
        productId: string | null;
        productName: string | null;
        userPhone: string;
        userName: string;
        userId: string;
        rating: number;
        comment: string | null;
        flagged: boolean;
        moderatedById: string | null;
        moderatedAt: Date | null;
    }>;
}
