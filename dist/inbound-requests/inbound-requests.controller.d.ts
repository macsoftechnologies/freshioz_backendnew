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
            updatedAt: Date;
            uuid: string;
            societyName: string;
            status: string;
            createdAt: Date;
            address: string | null;
            contactName: string;
            contactPhone: string;
            contactRole: string | null;
            flatCount: number | null;
            clusterZone: string | null;
        }[];
        unreadCount: number;
    }>;
    create(body: CreateLeadDto): Promise<{
        createdDateIST: string;
        createdTimeIST: string;
        id: string;
        updatedAt: Date;
        uuid: string;
        societyName: string;
        status: string;
        createdAt: Date;
        address: string | null;
        contactName: string;
        contactPhone: string;
        contactRole: string | null;
        flatCount: number | null;
        clusterZone: string | null;
    }>;
    updateStatus(body: UpdateLeadDto): Promise<{
        createdDateIST: string;
        createdTimeIST: string;
        id: string;
        updatedAt: Date;
        uuid: string;
        societyName: string;
        status: string;
        createdAt: Date;
        address: string | null;
        contactName: string;
        contactPhone: string;
        contactRole: string | null;
        flatCount: number | null;
        clusterZone: string | null;
    }>;
}
