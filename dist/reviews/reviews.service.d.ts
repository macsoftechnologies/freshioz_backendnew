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
        updatedAt: Date;
        uuid: string;
        userName: string;
        userPhone: string;
        status: string;
        createdAt: Date;
        userId: string;
        type: string;
        productId: string | null;
        orderId: string | null;
        productName: string | null;
        rating: number;
        comment: string | null;
        flagged: boolean;
        moderatedById: string | null;
        moderatedAt: Date | null;
    }>;
    updateReview(id: string, user: any, dto: UpdateReviewDto): Promise<{
        id: string;
        updatedAt: Date;
        uuid: string;
        userName: string;
        userPhone: string;
        status: string;
        createdAt: Date;
        userId: string;
        type: string;
        productId: string | null;
        orderId: string | null;
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
            userName: string;
            createdAt: Date;
            rating: number;
            comment: string;
        }[];
    }>;
    getWebsiteReviewsPublic(): Promise<{
        id: string;
        userName: string;
        createdAt: Date;
        rating: number;
        comment: string;
    }[]>;
    getCustomerReviews(user: any): Promise<{
        id: string;
        updatedAt: Date;
        uuid: string;
        userName: string;
        userPhone: string;
        status: string;
        createdAt: Date;
        userId: string;
        type: string;
        productId: string | null;
        orderId: string | null;
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
        updatedAt: Date;
        uuid: string;
        userName: string;
        userPhone: string;
        status: string;
        createdAt: Date;
        userId: string;
        type: string;
        productId: string | null;
        orderId: string | null;
        productName: string | null;
        rating: number;
        comment: string | null;
        flagged: boolean;
        moderatedById: string | null;
        moderatedAt: Date | null;
    }[]>;
    moderateReview(id: string, staffUser: any, status: 'APPROVED' | 'HIDDEN', flagged?: boolean): Promise<{
        id: string;
        updatedAt: Date;
        uuid: string;
        userName: string;
        userPhone: string;
        status: string;
        createdAt: Date;
        userId: string;
        type: string;
        productId: string | null;
        orderId: string | null;
        productName: string | null;
        rating: number;
        comment: string | null;
        flagged: boolean;
        moderatedById: string | null;
        moderatedAt: Date | null;
    }>;
}
