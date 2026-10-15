import { Injectable, NotFoundException } from '@nestjs/common';
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
    const newLead = await this.prisma.inboundLead.create({
      data: {
        id: id || `FRZ_LEAD_${Date.now()}`,
        societyName,
        contactName,
        contactPhone,
        contactRole: contactRole || 'Resident',
        flatCount: flatCount ? parseInt(flatCount) : null,
        clusterZone: clusterZone || 'Bangalore East',
        address: address || null,
        status: 'NEW_LEAD',
      },
    });

    return {
      ...newLead,
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
