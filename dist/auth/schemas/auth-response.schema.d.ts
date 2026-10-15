export declare class AuthUserSchema {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    roles?: string[];
    assignedWarehouseId?: string;
    type: string;
}
export declare class AuthResponseSchema {
    success: boolean;
    token: string;
    tokenType: string;
    expiresIn: string;
    type: string;
    user: AuthUserSchema;
}
