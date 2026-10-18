import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto, PartnerLoginDto } from './dto/register.dto';
export declare class AuthService {
    private readonly prisma;
    private readonly jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    comparePassword(plain: string, hashOrPlain: string): Promise<boolean>;
    login(body: {
        email?: string;
        phone?: string;
        password?: string;
    }): Promise<{
        success: boolean;
        token: string;
        tokenType: string;
        expiresIn: string;
        type: string;
        user: {
            id: string;
            uuid: string;
            name: string;
            email: string;
            phone: string;
            roles: string[];
            assignedWarehouseId: string;
            warehouseId: string;
            type: string;
        };
    } | {
        success: boolean;
        token: string;
        tokenType: string;
        expiresIn: string;
        type: string;
        user: {
            id: string;
            uuid: string;
            name: string;
            phone: string;
            email: string;
            societyId: string;
            societyName: string;
            flatNo: string;
            type: string;
        };
    }>;
    register(body: RegisterDto): Promise<{
        success: boolean;
        token: string;
        tokenType: string;
        expiresIn: string;
        type: string;
        user: {
            id: string;
            uuid: string;
            name: string;
            phone: string;
            email: string;
            societyId: string;
            societyName: string;
            flatNo: string;
            type: string;
        };
    }>;
    partnerLogin(body: PartnerLoginDto): Promise<{
        success: boolean;
        token: string;
        tokenType: string;
        expiresIn: string;
        type: string;
        user: {
            id: string;
            uuid: string;
            societyId: string;
            societyName: string;
            secretaryName: string;
            phone: string;
            type: string;
            roles: string[];
        };
    }>;
    verifyToken(authHeader?: string): {
        authenticated: boolean;
        user: any;
    };
}
