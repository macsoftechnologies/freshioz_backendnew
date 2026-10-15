export declare class LeadSchema {
    id: string;
    societyName: string;
    contactName: string;
    contactPhone: string;
    contactRole?: string;
    flatCount?: number;
    clusterZone?: string;
    address?: string;
    status: string;
    createdDateIST: string;
    createdTimeIST: string;
}
export declare class InboundLeadsResponseSchema {
    leads: LeadSchema[];
    unreadCount: number;
}
