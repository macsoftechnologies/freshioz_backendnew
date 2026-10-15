const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Freshioz Production Database with core taxonomies & Super Admin...');

  // 1. Seed Core Categories (Strictly Vegetables and Fruits per business rule)
  const categories = [
    { id: 'VEGETABLES', name: 'Vegetables', slug: 'vegetables', icon: '🥦', description: 'Fresh farm harvests & greens' },
    { id: 'FRUITS', name: 'Fresh Fruits', slug: 'fruits', icon: '🍎', description: 'Hand-picked fresh fruits' },
  ];

  for (const c of categories) {
    await prisma.category.upsert({
      where: { id: c.id },
      update: { name: c.name, slug: c.slug, icon: c.icon, description: c.description },
      create: { id: c.id, name: c.name, slug: c.slug, icon: c.icon, description: c.description },
    });
  }
  console.log('✅ Categories seeded: Vegetables, Fresh Fruits');

  // 2. Seed Standard Units
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
      update: { name: u.name, label: u.label, isBulk: u.isBulk },
      create: { id: u.id, name: u.name, label: u.label, isBulk: u.isBulk },
    });
  }
  console.log('✅ Standard Produce Units seeded');

  // 3. Seed Super Admin with secure bcrypt hashed password (configurable via INITIAL_ADMIN_PASSWORD or defaults to 123456)
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
  console.log(`✅ Super Admin employee seeded (Email: superadmin@gmail.com)`);

  console.log('🎉 Clean seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
