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
        id: string;
        uuid: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        type: string;
        orderId: string | null;
        productId: string | null;
        userId: string;
        userName: string;
        userPhone: string;
        productName: string | null;
        rating: number;
        comment: string | null;
        flagged: boolean;
        moderatedById: string | null;
        moderatedAt: Date | null;
    }>;
    updateReview(id: string, user: any, dto: UpdateReviewDto): Promise<{
        id: string;
        uuid: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        type: string;
        orderId: string | null;
        productId: string | null;
        userId: string;
        userName: string;
        userPhone: string;
        productName: string | null;
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
        id: string;
        uuid: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        type: string;
        orderId: string | null;
        productId: string | null;
        userId: string;
        userName: string;
        userPhone: string;
        productName: string | null;
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
        id: string;
        uuid: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        type: string;
        orderId: string | null;
        productId: string | null;
        userId: string;
        userName: string;
        userPhone: string;
        productName: string | null;
        rating: number;
        comment: string | null;
        flagged: boolean;
        moderatedById: string | null;
        moderatedAt: Date | null;
    }[]>;
    moderateReview(id: string, staffUser: any, status: 'APPROVED' | 'HIDDEN', flagged?: boolean): Promise<{
        id: string;
        uuid: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        type: string;
        orderId: string | null;
        productId: string | null;
        userId: string;
        userName: string;
        userPhone: string;
        productName: string | null;
        rating: number;
        comment: string | null;
        flagged: boolean;
        moderatedById: string | null;
        moderatedAt: Date | null;
    }>;
}
