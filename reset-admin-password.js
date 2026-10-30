const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const newPassword = process.argv[2] || 'Freshioz@123';
  const email = (process.argv[3] || 'superadmin@gmail.com').trim().toLowerCase();

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  const updated = await prisma.employee.upsert({
    where: { email },
    update: {
      password: hashedPassword,
      status: 'ACTIVE',
      roles: ['SUPER_ADMIN']
    },
    create: {
      id: 'FRZ_EMP_101',
      uuid: 'e1010000-0000-4000-8000-000000000101',
      name: 'Super Admin',
      phone: '9999999999',
      email,
      password: hashedPassword,
      roles: ['SUPER_ADMIN'],
      assignedWarehouseId: 'ALL',
      status: 'ACTIVE'
    }
  });

  console.log('\n======================================================');
  console.log('✅ Super Admin Account Ready:');
  console.log(`   Email:    ${updated.email}`);
  console.log(`   Password: ${newPassword}`);
  console.log(`   Status:   ${updated.status}`);
  console.log(`   Roles:    ${updated.roles.join(', ')}`);
  console.log('======================================================\n');
}

main()
  .catch((e) => {
    console.error('❌ Failed to update admin password:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

