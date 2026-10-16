import { Injectable, InternalServerErrorException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { toISTFullString } from '../common/date-utils';

const EMPLOYEE_PUBLIC_FIELDS = {
  id: true,
  uuid: true,
  name: true,
  phone: true,
  email: true,
  roles: true,
  assignedWarehouseId: true,
  status: true,
  dateJoined: true,
  createdAt: true,
  updatedAt: true,
};

@Injectable()
export class StoreService {
  constructor(private readonly prisma: PrismaService) {}

  async getCombinedStore(currentUser?: any) {
    const isStaffOrAdmin = Boolean(
      currentUser &&
      currentUser.type === 'EMPLOYEE' &&
      Array.isArray(currentUser.roles) &&
      !currentUser.roles.includes('SOCIETY_PARTNER')
    );
    const isPartner = Boolean(
      currentUser && (currentUser.type === 'PARTNER' || currentUser.roles?.includes('SOCIETY_PARTNER'))
    );
    const partnerSocietyId = isPartner ? (currentUser.societyId || currentUser.id) : null;

    // 1. Fetch live entities exclusively from PostgreSQL
    const [
      warehouses,
      products,
      societies,
      orders,
      vendors,
      procurementBills,
      inventoryEntries,
      leads,
      employees,
      categories,
      units,
      payouts,
    ] = await Promise.all([
      this.prisma.warehouse.findMany({ orderBy: { createdAt: 'desc' } }),
      this.prisma.product.findMany({
        where: { status: { not: 'ARCHIVED' } },
        include: { category: true },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.society.findMany({ orderBy: { createdAt: 'desc' } }),
      isStaffOrAdmin
        ? this.prisma.order.findMany({
            include: { items: true },
            orderBy: { orderPlacedAt: 'desc' },
          })
        : isPartner && partnerSocietyId
        ? this.prisma.order.findMany({
            where: { societyId: partnerSocietyId },
            include: { items: true },
            orderBy: { orderPlacedAt: 'desc' },
          })
        : currentUser?.phone
        ? this.prisma.order.findMany({
            where: {
              OR: [
                { userPhone: currentUser.phone },
                { userId: currentUser.id || currentUser.phone },
              ],
            },
            include: { items: true },
            orderBy: { orderPlacedAt: 'desc' },
          })
        : Promise.resolve([]),
      isStaffOrAdmin
        ? this.prisma.vendor.findMany({ orderBy: { createdAt: 'desc' } })
        : Promise.resolve([]),
      isStaffOrAdmin
        ? this.prisma.procurementBill.findMany({ orderBy: { createdAt: 'desc' } })
        : Promise.resolve([]),
      isStaffOrAdmin
        ? this.prisma.warehouseInventory.findMany({
            include: { product: true, warehouse: true },
          })
        : Promise.resolve([]),
      isStaffOrAdmin
        ? this.prisma.inboundLead.findMany({ orderBy: { createdAt: 'desc' } })
        : Promise.resolve([]),
      isStaffOrAdmin
        ? this.prisma.employee.findMany({
            select: EMPLOYEE_PUBLIC_FIELDS,
            orderBy: { dateJoined: 'desc' },
          })
        : Promise.resolve([]),
      this.prisma.category.findMany({ orderBy: { sortOrder: 'asc' } }),
      this.prisma.unit.findMany({ orderBy: { createdAt: 'asc' } }),
      isStaffOrAdmin
        ? this.prisma.societyPayout.findMany({
            include: { society: true },
            orderBy: { createdAt: 'desc' },
          })
        : isPartner && partnerSocietyId
        ? this.prisma.societyPayout.findMany({
            where: { societyId: partnerSocietyId },
            include: { society: true },
            orderBy: { createdAt: 'desc' },
          })
        : Promise.resolve([]),
    ]);

    // Format orders for UI
    const formattedOrders = orders.map((o) => ({
      ...o,
      orderPlacedAtFormatted: toISTFullString(o.orderPlacedAt),
      items: o.items || [],
    }));

    // Format procurement logs
    const formattedProcurement = procurementBills.map((b) => ({
      ...b,
      formattedDate: toISTFullString(b.procuredAt).split(',')[0],
      formattedTime: toISTFullString(b.procuredAt).split(',')[1]?.trim(),
    }));

    // Format withdrawals
    const formattedWithdrawals = payouts.map((p) => ({
      id: p.id,
      societyId: p.societyId,
      societyName: p.society?.name || 'Society Partner',
      amount: p.amount,
      status: p.status,
      bankUtr: p.transactionRef,
      transactionRef: p.transactionRef,
      paymentMethod: p.paymentMethod,
      notes: p.notes,
      disbursedBy: p.authorizedBy,
      createdAt: p.createdAt,
    }));

    // Build inventory nested dictionary map for admin components
    const inventoryMap: Record<string, Record<string, number>> = {};
    if (isStaffOrAdmin) {
      for (const entry of inventoryEntries) {
        if (!inventoryMap[entry.warehouseId]) {
          inventoryMap[entry.warehouseId] = {};
        }
        inventoryMap[entry.warehouseId][entry.productId] = entry.currentQty;
        if (entry.product?.name) {
          inventoryMap[entry.warehouseId][entry.product.name] = entry.currentQty;
        }
      }
    }

    // Sanitize banking data for public consumption
    const sanitizedSocieties = societies.map((s) => ({
      ...s,
      accountNumber: s.accountNumber ? `••••${s.accountNumber.slice(-4)}` : null,
      ifscCode: s.ifscCode ? `••••${s.ifscCode.slice(-4)}` : null,
      secretaryPhone: s.secretaryPhone ? `••••${s.secretaryPhone.slice(-4)}` : null,
    }));

    const sanitizedVendors = vendors.map((v) => ({
      ...v,
      accountNumber: v.accountNumber ? `••••${v.accountNumber.slice(-4)}` : null,
      ifscCode: v.ifscCode ? `••••${v.ifscCode.slice(-4)}` : null,
      upiId: v.upiId ? `••••${v.upiId.slice(-4)}` : null,
      phone: v.phone ? `••••${v.phone.slice(-4)}` : null,
    }));

    const sanitizedWarehouses = warehouses.map((w) => ({
      id: w.id,
      uuid: w.uuid,
      code: w.code,
      name: w.name,
      location: w.location,
      lat: w.lat,
      lng: w.lng,
      openTime: w.openTime,
      cutoffTime: w.cutoffTime,
      status: w.status,
      managerPhone: (isStaffOrAdmin && w.managerPhone) ? w.managerPhone : (w.managerPhone ? `••••${w.managerPhone.slice(-4)}` : null),
      ...(isStaffOrAdmin && {
        capacityTons: w.capacityTons,
        managerName: w.managerName,
      }),
      createdAt: w.createdAt,
      updatedAt: w.updatedAt,
    }));

    const formattedProducts = products.map((p: any) => ({
      ...p,
      category: p.category?.name || p.categoryId || 'VEGETABLES',
      categoryId: p.categoryId,
    }));

    return {
      warehouses: sanitizedWarehouses,
      products: formattedProducts,
      societies: sanitizedSocieties,
      orders: formattedOrders,
      vendors: sanitizedVendors,
      procurementLogs: formattedProcurement,
      warehouseInventory: isStaffOrAdmin ? inventoryMap : {},
      warehouseInventoryEntries: isStaffOrAdmin ? inventoryEntries : [],
      societyRequests: leads,
      employees,
      categories,
      units,
      withdrawals: formattedWithdrawals,
      backendConnected: true,
      syncedAtIST: toISTFullString(new Date()),
    };
  }

  async saveStore(data: any, user?: any) {
    const roles: string[] = user?.roles || [];
    const isSuperAdmin = roles.includes('SUPER_ADMIN');
    const isWarehouseManager = isSuperAdmin || roles.includes('WAREHOUSE_MANAGER');
    const isPricingManager = isSuperAdmin || roles.includes('PRICING_MANAGER');
    const isProcurementOfficer = isSuperAdmin || roles.includes('PROCUREMENT_OFFICER');
    const isSalesOfficer = isSuperAdmin || roles.includes('SALES_OFFICER');
    const isFulfillmentStaff = isSuperAdmin || isWarehouseManager || roles.some((r: string) => ['WAREHOUSE_STAFF', 'DELIVERY_EXECUTIVE'].includes(r));

    const persisted: string[] = [];
    const skipped: string[] = [];

    try {
      await retryTransactionOnDeadlock(() => {
        persisted.length = 0;
        skipped.length = 0;
        return this.prisma.$transaction(async (tx) => {
        // 1. Warehouses (Super Admin or Warehouse Manager)
        if (Array.isArray(data.warehouses)) {
          if (isSuperAdmin || isWarehouseManager) {
            persisted.push('warehouses');
            for (const w of data.warehouses) {
              if (!w.id || !w.name) continue;
              await tx.warehouse.upsert({
                where: { id: w.id },
                update: {
                  name: w.name,
                  code: w.code || `WH-${w.id.slice(-4)}`,
                  location: w.location || w.address || 'Bengaluru Hub',
                  lat: w.lat ? parseFloat(w.lat) : null,
                  lng: w.lng ? parseFloat(w.lng) : null,
                  status: w.status || 'ACTIVE',
                },
                create: {
                  id: w.id,
                  name: w.name,
                  code: w.code || `WH-${w.id.slice(-4)}`,
                  location: w.location || w.address || 'Bengaluru Hub',
                  lat: w.lat ? parseFloat(w.lat) : null,
                  lng: w.lng ? parseFloat(w.lng) : null,
                  status: w.status || 'ACTIVE',
                },
              });
            }
          } else {
            skipped.push('warehouses');
          }
        }

        // 2. Products (Super Admin, Pricing Manager, or Warehouse Manager)
        if (Array.isArray(data.deletedProductIds) && (isSuperAdmin || isPricingManager || isWarehouseManager)) {
          persisted.push('deletedProductIds');
          for (const delId of data.deletedProductIds) {
            try {
              const existingProd = await tx.product.findFirst({
                where: {
                  OR: [{ id: delId }, { uuid: delId }],
                },
                include: { orderItems: true },
              });
              if (existingProd) {
                if (existingProd.orderItems && existingProd.orderItems.length > 0) {
                  await tx.product.update({
                    where: { id: existingProd.id },
                    data: { status: 'ARCHIVED' },
                  });
                } else {
                  await tx.dailyPriceHistory.deleteMany({ where: { productId: existingProd.id } });
                  await tx.warehouseInventory.deleteMany({ where: { productId: existingProd.id } });
                  await tx.product.delete({ where: { id: existingProd.id } });
                }
              }
            } catch (e) {
              console.error(`Error deleting product ${delId}:`, e);
            }
          }
        }

        if (Array.isArray(data.products)) {
          if (isSuperAdmin || isPricingManager || isWarehouseManager) {
            persisted.push('products');
            for (const p of data.products) {
              if (!p.id || !p.name) continue;
              const rawCatId = p.categoryId || p.category || 'VEGETABLES';
              const targetSlug = rawCatId.toLowerCase().replace(/[^a-z0-9]/g, '-');
              let existingCat = await tx.category.findFirst({
                where: {
                  OR: [
                    { id: rawCatId },
                    { slug: targetSlug }
                  ]
                }
              });
              if (!existingCat) {
                const slugConflict = await tx.category.findUnique({ where: { slug: targetSlug } });
                if (slugConflict) {
                  existingCat = slugConflict;
                } else {
                  existingCat = await tx.category.create({
                    data: {
                      id: rawCatId,
                      name: rawCatId.replace(/_/g, ' '),
                      slug: targetSlug,
                      icon: '🥦',
                    },
                  });
                }
              }
              const catId = existingCat.id;
              const unit = p.retailUnit || p.defaultUnit || '1 kg';
              await tx.product.upsert({
                where: { id: p.id },
                update: {
                  name: p.name,
                  kannadaName: p.kannadaName || null,
                  categoryId: catId,
                  retailUnit: unit,
                  retailPrice: parseFloat(p.retailPrice) || 40,
                  retailMarketPrice: parseFloat(p.retailMarketPrice) || 50,
                  bulkMinQty: parseFloat(p.bulkMinQty) || 0,
                  bulkDiscountPercent: parseFloat(p.bulkDiscountPercent) || 0,
                  origin: p.origin || 'APMC Mandi',
                  shelfLife: p.shelfLife || '3-5 Days',
                  desc: p.desc || null,
                  ...(p.image && { image: p.image }),
                  ...(p.badge && { badge: p.badge }),
                  tags: Array.isArray(p.tags) ? p.tags : [],
                  gstPercent: parseFloat(p.gstPercent) || 0,
                  status: p.status || 'ACTIVE',
                  inStock: p.inStock !== false,
                },
                create: {
                  id: p.id,
                  name: p.name,
                  kannadaName: p.kannadaName || null,
                  categoryId: catId,
                  retailUnit: unit,
                  retailPrice: parseFloat(p.retailPrice) || 40,
                  retailMarketPrice: parseFloat(p.retailMarketPrice) || 50,
                  bulkMinQty: parseFloat(p.bulkMinQty) || 0,
                  bulkDiscountPercent: parseFloat(p.bulkDiscountPercent) || 0,
                  origin: p.origin || 'APMC Mandi',
                  shelfLife: p.shelfLife || '3-5 Days',
                  desc: p.desc || null,
                  image: p.image || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600',
                  badge: p.badge || 'Harvested Today at Dawn',
                  tags: Array.isArray(p.tags) ? p.tags : [],
                  gstPercent: parseFloat(p.gstPercent) || 0,
                  status: p.status || 'ACTIVE',
                  inStock: p.inStock !== false,
                },
              });
            }
          } else {
            skipped.push('products');
          }
        }

      // 3. Societies (Super Admin or Sales Officer)
      if (Array.isArray(data.societies)) {
        if (isSuperAdmin || isSalesOfficer) {
          persisted.push('societies');
          for (const s of data.societies) {
            if (!s.id || !s.name) continue;
            await tx.society.upsert({
              where: { id: s.id },
              update: {
                name: s.name,
                address: s.address || 'Bengaluru Apartment',
                status: s.status || 'APPROVED',
                commissionType: s.commissionType || 'PERCENTAGE',
                commissionValue: parseFloat(s.commissionValue) || 3.5,
                ...(s.warehouseId !== undefined && { warehouseId: s.warehouseId }),
              },
              create: {
                id: s.id,
                name: s.name,
                address: s.address || 'Bengaluru Apartment',
                status: s.status || 'APPROVED',
                commissionType: s.commissionType || 'PERCENTAGE',
                commissionValue: parseFloat(s.commissionValue) || 3.5,
                warehouseId: s.warehouseId || null,
                secretaryName: s.secretaryName || s.primaryContact || null,
                secretaryPhone: s.secretaryPhone || s.phone || null,
              },
            });
          }
        } else {
          skipped.push('societies');
        }
      }

      // 4. Vendors (Super Admin or Procurement Officer)
      if (Array.isArray(data.vendors)) {
        if (isSuperAdmin || isProcurementOfficer) {
          persisted.push('vendors');
          for (const v of data.vendors) {
            if (!v.id || !v.name) continue;
            await tx.vendor.upsert({
              where: { id: v.id },
              update: {
                name: v.name,
                phone: v.phone || '9845000000',
                category: v.category || 'COMMISSION_AGENT',
                mandiLocation: v.mandiLocation || 'Kolar APMC Mandi',
                lat: v.lat ? parseFloat(v.lat) : null,
                lng: v.lng ? parseFloat(v.lng) : null,
                bankName: v.bankName || null,
                accountHolder: v.accountHolder || null,
                accountNumber: v.accountNumber || null,
                ifscCode: v.ifscCode || null,
                upiId: v.upiId || null,
                status: v.status || 'ACTIVE',
              },
              create: {
                id: v.id,
                name: v.name,
                phone: v.phone || '9845000000',
                category: v.category || 'COMMISSION_AGENT',
                mandiLocation: v.mandiLocation || 'Kolar APMC Mandi',
                lat: v.lat ? parseFloat(v.lat) : null,
                lng: v.lng ? parseFloat(v.lng) : null,
                bankName: v.bankName || null,
                accountHolder: v.accountHolder || null,
                accountNumber: v.accountNumber || null,
                ifscCode: v.ifscCode || null,
                upiId: v.upiId || null,
                status: v.status || 'ACTIVE',
              },
            });
          }
        } else {
          skipped.push('vendors');
        }
      }

      // 5. Procurement Bills (Super Admin, Procurement Officer, or Warehouse Manager)
      if (Array.isArray(data.procurementLogs)) {
        if (isSuperAdmin || isProcurementOfficer || isWarehouseManager) {
          persisted.push('procurementLogs');
          for (const b of data.procurementLogs) {
            if (!b.id || !b.destinationWarehouseId) continue;
            await tx.procurementBill.upsert({
              where: { id: b.id },
              update: {
                vendorName: b.vendorName || 'Mandi Commission Agent',
                mandiLocation: b.mandiLocation || 'Kolar APMC Mandi',
                destinationName: b.destinationName || 'Bengaluru Hub',
                paymentMode: b.paymentMode || 'IMPS_TRANSFER',
                totalWeightKg: parseFloat(b.totalWeightKg) || 0,
                produceAmount: parseFloat(b.produceAmount) || 0,
                transportAmount: parseFloat(b.transportAmount) || 0,
                totalAmountPaid: parseFloat(b.totalAmountPaid) || 0,
                procuredBy: b.procuredBy || 'Procurement Officer',
                slot: b.slot || 'Morning Fresh Slot',
                items: b.items || [],
              },
              create: {
                id: b.id,
                billNumber: b.billNumber || b.id,
                vendorId: b.vendorId || null,
                vendorName: b.vendorName || 'Mandi Commission Agent',
                mandiLocation: b.mandiLocation || 'Kolar APMC Mandi',
                destinationWarehouseId: b.destinationWarehouseId,
                destinationName: b.destinationName || 'Bengaluru Hub',
                paymentMode: b.paymentMode || 'IMPS_TRANSFER',
                totalWeightKg: parseFloat(b.totalWeightKg) || 0,
                produceAmount: parseFloat(b.produceAmount) || 0,
                transportAmount: parseFloat(b.transportAmount) || 0,
                totalAmountPaid: parseFloat(b.totalAmountPaid) || 0,
                procuredBy: b.procuredBy || 'Procurement Officer',
                slot: b.slot || 'Morning Fresh Slot',
                items: b.items || [],
              },
            });
          }
        } else {
          skipped.push('procurementLogs');
        }
      }

      // 6. Orders (Super Admin, Warehouse Manager, or Fulfillment Staff)
      if (Array.isArray(data.orders)) {
        if (isFulfillmentStaff) {
          persisted.push('orders');
          for (const o of data.orders) {
            if (!o.id || !o.userPhone) continue;
            // Ensure user exists first
            await tx.user.upsert({
              where: { phone: o.userPhone },
              update: {
                name: o.userName || 'Customer',
              },
              create: {
                id: `USR_${o.userPhone}`,
                phone: o.userPhone,
                name: o.userName || 'Customer',
                societyId: o.societyId || null,
                flatNo: o.flatNo || null,
              },
            });

            await tx.order.upsert({
              where: { id: o.id },
              update: {
                status: o.status || 'CONFIRMED',
                paymentStatus: o.paymentStatus || 'PAID',
                ...(o.status === 'DELIVERED' && { deliveredAt: new Date() }),
                ...(o.codCollectedAmount !== undefined && { codCollectedAmount: parseFloat(o.codCollectedAmount) }),
                ...(o.codCollectedBy && { codCollectedBy: o.codCollectedBy }),
              },
              create: {
                id: o.id,
                userId: o.userPhone,
                userName: o.userName || 'Customer',
                userPhone: o.userPhone,
                societyId: o.societyId || null,
                societyName: o.societyName || 'Direct Resident Delivery',
                flatNo: o.flatNo || null,
                warehouseId: o.warehouseId || null,
                warehouseCode: o.warehouseCode || null,
                orderType: o.orderType || 'RETAIL',
                subtotal: parseFloat(o.subtotal) || 0,
                bulkSavings: parseFloat(o.bulkSavings) || 0,
                deliveryFee: parseFloat(o.deliveryFee) || 0,
                gstAmount: parseFloat(o.gstAmount) || 0,
                totalAmount: parseFloat(o.totalAmount) || 0,
                deliveryDate: o.deliveryDate || '16/10/2026',
                deliverySlot: o.deliverySlot || 'Morning 06:00 AM - 08:30 AM',
                status: o.status || 'CONFIRMED',
                paymentMethod: o.paymentMethod || 'UPI',
                paymentStatus: o.paymentStatus || 'PAID',
                societyCommissionEarned: parseFloat(o.societyCommissionEarned) || 0,
              },
            });
          }
        } else {
          skipped.push('orders');
        }
      }

      // 7. Employees (Strictly Super Admin Only)
      if (Array.isArray(data.employees) && data.employees.length > 0) {
        if (isSuperAdmin) {
          persisted.push('employees');
          for (const e of data.employees) {
            if (!e.id || !e.email || !e.name) continue;
            try {
              const targetEmail = e.email.toLowerCase().trim();
              const existingEmp = await tx.employee.findFirst({
                where: { OR: [{ id: e.id }, { email: targetEmail }] },
                select: { id: true, phone: true, roles: true, assignedWarehouseId: true, status: true },
              });
              if (existingEmp) {
                await tx.employee.update({
                  where: { id: existingEmp.id },
                  data: {
                    name: e.name,
                    phone: e.phone || existingEmp.phone,
                    roles: e.roles || existingEmp.roles,
                    assignedWarehouseId: e.assignedWarehouseId || existingEmp.assignedWarehouseId,
                    status: e.status || existingEmp.status,
                  },
                });
              } else {
                await tx.employee.create({
                  data: {
                    id: e.id,
                    name: e.name,
                    phone: e.phone || '9999999999',
                    email: targetEmail,
                    password: e.password || '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6x8ec5PkWNeqmPjUhyau',
                    roles: e.roles || [e.role || 'SUPER_ADMIN'],
                    assignedWarehouseId: e.assignedWarehouseId || 'ALL',
                    status: e.status || 'ACTIVE',
                  },
                });
              }
            } catch (empErr: any) {
              console.warn(`[Store Sync] Skipping employee sync item ${e.id}: ${empErr?.message || empErr}`);
            }
          }
        } else {
          skipped.push('employees');
        }
      }

      // 8. Society Requests / Inbound Leads (Super Admin or Sales Officer)
      if (Array.isArray(data.societyRequests)) {
        if (isSuperAdmin || isSalesOfficer) {
          persisted.push('societyRequests');
          for (const r of data.societyRequests) {
            if (!r.id || !r.societyName) continue;
            await tx.inboundLead.upsert({
              where: { id: r.id },
              update: {
                societyName: r.societyName,
                contactName: r.contactName || r.name || 'Resident',
                contactPhone: r.contactPhone || r.phone || '9999999999',
                contactRole: r.contactRole || r.role || 'Resident',
                flatCount: parseInt(r.flatCount || r.flats) || 50,
                clusterZone: r.clusterZone || r.zone || 'Bengaluru',
                address: r.address || '',
                status: r.status || 'NEW_LEAD',
              },
              create: {
                id: r.id,
                societyName: r.societyName,
                contactName: r.contactName || r.name || 'Resident',
                contactPhone: r.contactPhone || r.phone || '9999999999',
                contactRole: r.contactRole || r.role || 'Resident',
                flatCount: parseInt(r.flatCount || r.flats) || 50,
                clusterZone: r.clusterZone || r.zone || 'Bengaluru',
                address: r.address || '',
                status: r.status || 'NEW_LEAD',
              },
            });
          }
        } else {
          skipped.push('societyRequests');
        }
      }

      // 9. Categories & Units (Strictly Super Admin Only)
      if (Array.isArray(data.categories)) {
        if (isSuperAdmin) {
          persisted.push('categories');
          for (const c of data.categories) {
            if (!c.id || !c.name) continue;
            const targetSlug = c.slug || c.id.toLowerCase().replace(/[^a-z0-9]/g, '-');
            const existingCat = await tx.category.findFirst({
              where: {
                OR: [
                  { id: c.id },
                  { slug: targetSlug }
                ]
              }
            });
            const targetId = existingCat ? existingCat.id : c.id;

            await tx.category.upsert({
              where: { id: targetId },
              update: {
                name: c.name,
                slug: targetSlug,
                icon: c.icon || '🌱',
                description: c.description || null,
                status: c.status || 'ACTIVE',
                sortOrder: typeof c.sortOrder === 'number' ? c.sortOrder : 0,
              },
              create: {
                id: targetId,
                name: c.name,
                slug: targetSlug,
                icon: c.icon || '🌱',
                description: c.description || null,
                status: c.status || 'ACTIVE',
                sortOrder: typeof c.sortOrder === 'number' ? c.sortOrder : 0,
              },
            });
          }
        } else {
          skipped.push('categories');
        }
      }

      if (Array.isArray(data.units)) {
        if (isSuperAdmin) {
          persisted.push('units');
          for (const u of data.units) {
            if (!u.id || !u.name) continue;
            await tx.unit.upsert({
              where: { id: u.id },
              update: {
                name: u.name,
                label: u.label || u.name,
                isBulk: Boolean(u.isBulk),
                description: u.description || null,
                status: u.status || 'ACTIVE',
              },
              create: {
                id: u.id,
                name: u.name,
                label: u.label || u.name,
                isBulk: Boolean(u.isBulk),
                description: u.description || null,
                status: u.status || 'ACTIVE',
              },
            });
          }
        } else {
          skipped.push('units');
        }
      }

      // 10. Withdrawals / Disbursals (Strictly Super Admin Only)
      if (Array.isArray(data.withdrawals)) {
        if (isSuperAdmin) {
          persisted.push('withdrawals');
          for (const w of data.withdrawals) {
            if (!w.id || !w.societyId) continue;
            const societyExists = await tx.society.findUnique({ where: { id: w.societyId } });
            if (!societyExists) continue;

            await tx.societyPayout.upsert({
              where: { id: w.id },
              update: {
                amount: parseFloat(w.amount) || 0,
                status: w.status || 'COMPLETED',
                transactionRef: w.bankUtr || w.transactionRef || 'UTR-PENDING',
                paymentMethod: w.paymentMethod || 'NEFT_IMPS',
                notes: w.rejectionReason || w.notes || null,
                authorizedBy: w.disbursedBy || w.authorizedBy || null,
              },
              create: {
                id: w.id,
                societyId: w.societyId,
                amount: parseFloat(w.amount) || 0,
                status: w.status || 'COMPLETED',
                transactionRef: w.bankUtr || w.transactionRef || 'UTR-PENDING',
                paymentMethod: w.paymentMethod || 'NEFT_IMPS',
                notes: w.rejectionReason || w.notes || null,
                authorizedBy: w.disbursedBy || w.authorizedBy || null,
              },
            });
          }
        } else {
          skipped.push('withdrawals');
        }
      }

      // 11. Warehouse Inventory (Super Admin or Warehouse Manager)
      if (data.warehouseInventory) {
        if (isSuperAdmin || isWarehouseManager) {
          persisted.push('warehouseInventory');
          if (data.warehouseInventory && typeof data.warehouseInventory === 'object' && !Array.isArray(data.warehouseInventory)) {
            for (const [whId, prodMap] of Object.entries(data.warehouseInventory)) {
              if (!prodMap || typeof prodMap !== 'object') continue;
              const whExists = await tx.warehouse.findUnique({ where: { id: whId } });
              if (!whExists) continue;

              for (const [prodKey, qty] of Object.entries(prodMap as any)) {
                const numQty = parseFloat(qty as any) || 0;
                const prod = await tx.product.findFirst({
                  where: { OR: [{ id: prodKey }, { name: prodKey }] },
                });
                if (prod) {
                  await tx.warehouseInventory.upsert({
                    where: { warehouseId_productId: { warehouseId: whId, productId: prod.id } },
                    update: { currentQty: numQty },
                    create: { warehouseId: whId, productId: prod.id, currentQty: numQty },
                  });
                }
              }
            }
          } else if (Array.isArray(data.warehouseInventory)) {
            for (const entry of data.warehouseInventory) {
              if (!entry.warehouseId || !entry.productId) continue;
              await tx.warehouseInventory.upsert({
                where: { warehouseId_productId: { warehouseId: entry.warehouseId, productId: entry.productId } },
                update: {
                  currentQty: parseFloat(entry.currentQty) || 0,
                  reservedQty: parseFloat(entry.reservedQty) || 0,
                  unit: entry.unit || 'kg',
                },
                create: {
                  warehouseId: entry.warehouseId,
                  productId: entry.productId,
                  currentQty: parseFloat(entry.currentQty) || 0,
                  reservedQty: parseFloat(entry.reservedQty) || 0,
                  unit: entry.unit || 'kg',
                },
              });
            }
          }
        } else {
          skipped.push('warehouseInventory');
        }
      }

      // Only abort if user had NO authorized collections persisted at all:
      if (!isSuperAdmin && persisted.length === 0 && skipped.length > 0) {
        throw new ForbiddenException(
          `Access denied: Your account role (${roles.join(', ') || 'STAFF'}) does not have write permission for collection(s): ${skipped.join(', ')}.`,
        );
      }
    }, {
      timeout: 30000,
      maxWait: 5000,
    });
      });
    } catch (err: any) {
      if (err instanceof ForbiddenException) throw err;
      console.error('Error synchronizing store atomically to PostgreSQL:', err.message);
      throw new InternalServerErrorException(`Failed to synchronize store to database: ${err.message}`);
    }

    return {
      ok: true,
      persisted,
      skipped,
      syncedAtIST: toISTFullString(new Date()),
    };
  }
}

function isRetryableTransactionConflict(error: any): boolean {
  const errorCode = error?.code || error?.meta?.code || error?.cause?.code;
  return errorCode === 'P2034' || errorCode === '40P01' || /\b40P01\b/.test(error?.message || '');
}

async function retryTransactionOnDeadlock<T>(operation: () => Promise<T>): Promise<T> {
  for (let attempt = 1; ; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      if (!isRetryableTransactionConflict(error) || attempt >= 3) {
        throw error;
      }
      await new Promise((resolve) => setTimeout(resolve, 100 * attempt));
    }
  }
}
