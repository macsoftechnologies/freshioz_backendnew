import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto, PartnerLoginDto } from './dto/register.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(body: LoginDto): Promise<{
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
    verifySession(authHeader?: string): Promise<{
        authenticated: boolean;
        user: any;
    }>;
}
