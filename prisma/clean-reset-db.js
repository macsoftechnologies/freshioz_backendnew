const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🧹 Starting Freshioz Database Clean Reset...');

  // 1. Delete dependent transactional records first (foreign-key safe)
  console.log('Clearing transactional, order, and relation tables...');
  await prisma.orderItem.deleteMany({});
  await prisma.dailyPriceHistory.deleteMany({});
  await prisma.warehouseInventory.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.societyPayout.deleteMany({});
  await prisma.inboundLead.deleteMany({});
  await prisma.procurementBill.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.society.deleteMany({});
  await prisma.vendor.deleteMany({});
  await prisma.warehouse.deleteMany({});

  // 2. Clear non-superadmin employees (preserve Super Admin)
  await prisma.employee.deleteMany({
    where: {
      email: { not: 'superadmin@gmail.com' }
    }
  });

  // 3. Ensure Super Admin exists with credentials
  const initialAdminPass = process.env.INITIAL_ADMIN_PASSWORD || '123456';
  const hashedPassword = await bcrypt.hash(initialAdminPass, 10);
  await prisma.employee.upsert({
    where: { email: 'superadmin@gmail.com' },
    update: {
      password: hashedPassword,
      roles: ['SUPER_ADMIN'],
      assignedWarehouseId: 'ALL',
      status: 'ACTIVE',
    },
    create: {
      id: 'FRZ_EMP_101',
      uuid: 'e1010000-0000-4000-8000-000000000101',
      name: 'Super Admin',
      phone: '9999999999',
      email: 'superadmin@gmail.com',
      password: hashedPassword,
      roles: ['SUPER_ADMIN'],
      assignedWarehouseId: 'ALL',
      status: 'ACTIVE',
    },
  });
  console.log('✅ Super Admin employee confirmed: superadmin@gmail.com (Password: 123456)');

  // 4. Ensure Core Categories exist
  const categories = [
    { id: 'VEGETABLES', name: 'Vegetables', slug: 'vegetables', icon: '🥦', description: 'Fresh farm harvests & greens' },
    { id: 'FRUITS', name: 'Fresh Fruits', slug: 'fruits', icon: '🍎', description: 'Hand-picked fresh fruits' },
    { id: 'LEAFY_GREENS', name: 'Leafy Greens', slug: 'leafy-greens', icon: '🥬', description: 'Fresh plucked herbs & leaves' },
    { id: 'EXOTIC', name: 'Exotic & Salads', slug: 'exotic-salads', icon: '🥑', description: 'Hydroponics & imported exotics' },
  ];

  for (const c of categories) {
    await prisma.category.upsert({
      where: { id: c.id },
      update: { name: c.name, slug: c.slug, icon: c.icon, description: c.description, status: 'ACTIVE' },
      create: { id: c.id, name: c.name, slug: c.slug, icon: c.icon, description: c.description, status: 'ACTIVE' },
    });
  }
  console.log('✅ Master Categories preserved (Vegetables, Fruits, Leafy Greens, Exotic)');

  // 5. Ensure Standard Packing Units exist
  const units = [
    { id: 'kg', name: 'Kilogram', label: 'kg', isBulk: false },
    { id: 'g', name: 'Gram', label: 'g', isBulk: false },
    { id: 'bunch', name: 'Bunch', label: 'bunch', isBulk: false },
    { id: 'piece', name: 'Piece', label: 'pc', isBulk: false },
    { id: 'box', name: 'Box', label: 'box', isBulk: true },
    { id: 'crate', name: 'Crate', label: 'crate', isBulk: true },
    { id: 'tones', name: 'Tons', label: 'tons', isBulk: true },
  ];

  for (const u of units) {
    await prisma.unit.upsert({
      where: { id: u.id },
      update: { name: u.name, label: u.label, isBulk: u.isBulk, status: 'ACTIVE' },
      create: { id: u.id, name: u.name, label: u.label, isBulk: u.isBulk, status: 'ACTIVE' },
    });
  }
  console.log('✅ Standard Produce Units preserved (kg, g, bunch, piece, box, crate, tons)');

  console.log('✨ Freshioz Database Clean Reset Complete! You can now start end-to-end testing.');
}

main()
  .catch((e) => {
    console.error('❌ Clean Reset failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
