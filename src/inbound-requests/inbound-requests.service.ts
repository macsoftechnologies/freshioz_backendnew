import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { formatDateIST, formatTimeIST } from '../common/date-utils';

@Injectable()
export class InboundRequestsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const leads = await this.prisma.inboundLead.findMany({
      orderBy: { createdAt: 'desc' },
    });

    const unreadCount = leads.filter(l => l.status === 'NEW_LEAD').length;

    const formattedLeads = leads.map(l => ({
      ...l,
      requesterName: l.contactName,
      requesterPhone: l.contactPhone,
      estimatedFlats: l.flatCount,
      createdDateIST: formatDateIST(l.createdAt),
      createdTimeIST: formatTimeIST(l.createdAt),
    }));

    return {
      leads: formattedLeads,
      unreadCount,
    };
  }

  async create(body: any) {
    const { id, societyName, contactName, contactPhone, contactRole, flatCount, clusterZone, address } = body;
    const resolvedContactName = (contactName || body.requesterName || '').trim();
    const cleanPhone = (contactPhone || body.requesterPhone || '').toString().replace(/\D/g, '').trim();

    if (!societyName || !societyName.trim()) {
      throw new BadRequestException('Society / apartment name is required');
    }
    if (!resolvedContactName || resolvedContactName.length < 2) {
      throw new BadRequestException('Requester contact name is mandatory (minimum 2 characters)');
    }
    if (!cleanPhone || cleanPhone.length !== 10) {
      throw new BadRequestException('A valid 10-digit mobile phone number is strictly mandatory');
    }

    const newLead = await this.prisma.inboundLead.create({
      data: {
        id: id || `FRZ_LEAD_${Date.now()}`,
        societyName: societyName.trim(),
        contactName: resolvedContactName,
        contactPhone: cleanPhone,
        contactRole: contactRole || body.societyType || 'Resident',
        flatCount: flatCount ? parseInt(flatCount) : (body.estimatedFlats ? parseInt(body.estimatedFlats) : 150),
        clusterZone: clusterZone || body.city || 'Bangalore East',
        address: address || null,
        status: 'NEW_LEAD',
      },
    });

    return {
      ...newLead,
      requesterName: newLead.contactName,
      requesterPhone: newLead.contactPhone,
      estimatedFlats: newLead.flatCount,
      createdDateIST: formatDateIST(newLead.createdAt),
      createdTimeIST: formatTimeIST(newLead.createdAt),
    };
  }

  async updateStatus(id: string, status: string) {
    const existing = await this.prisma.inboundLead.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Lead not found');

    const updated = await this.prisma.inboundLead.update({
      where: { id },
      data: { status },
    });

    return {
      ...updated,
      createdDateIST: formatDateIST(updated.createdAt),
      createdTimeIST: formatTimeIST(updated.createdAt),
    };
  }
}
