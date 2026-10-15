export interface TokenPayload {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    roles?: string[];
    type: 'EMPLOYEE' | 'CUSTOMER';
    assignedWarehouseId?: string | null;
    societyId?: string | null;
}
export declare function generateToken(payload: TokenPayload): string;
export declare function verifyToken(token: string): TokenPayload | null;
export declare function extractTokenFromHeader(authHeader?: string | null): string | null;
export declare function hashPassword(plainText: string): Promise<string>;
export declare function comparePassword(plainText: string, storedHashOrPlain: string): Promise<boolean>;
