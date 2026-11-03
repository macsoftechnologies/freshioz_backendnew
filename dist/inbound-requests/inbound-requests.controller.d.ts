import { InboundRequestsService } from './inbound-requests.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
export declare class InboundRequestsController {
    private readonly inboundRequestsService;
    constructor(inboundRequestsService: InboundRequestsService);
    findAll(): Promise<{
        leads: {
            createdDateIST: string;
            createdTimeIST: string;
            id: string;
            uuid: string;
            societyName: string;
            contactName: string;
            contactPhone: string;
            contactRole: string | null;
            flatCount: number | null;
            clusterZone: string | null;
            address: string | null;
            status: string;
            createdAt: Date;
            updatedAt: Date;
        }[];
        unreadCount: number;
    }>;
    create(body: CreateLeadDto): Promise<{
        createdDateIST: string;
        createdTimeIST: string;
        id: string;
        uuid: string;
        societyName: string;
        contactName: string;
        contactPhone: string;
        contactRole: string | null;
        flatCount: number | null;
        clusterZone: string | null;
        address: string | null;
        status: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateStatus(body: UpdateLeadDto): Promise<{
        createdDateIST: string;
        createdTimeIST: string;
        id: string;
        uuid: string;
        societyName: string;
        contactName: string;
        contactPhone: string;
        contactRole: string | null;
        flatCount: number | null;
        clusterZone: string | null;
        address: string | null;
        status: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
