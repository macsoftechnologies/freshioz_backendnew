const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const newPassword = process.argv[2] || process.env.ADMIN_PASSWORD;

  if (!newPassword) {
    console.error('Error: Please provide the new password.');
    console.error('Usage: node scripts/reset-admin-password.js <your-new-password>');
    console.error('Example: node scripts/reset-admin-password.js MySecret@2026');
    process.exit(1);
  }

  const email = (process.argv[3] || 'superadmin@gmail.com').trim().toLowerCase();
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  console.log(`Resetting password for: ${email}`);

  const employee = await prisma.employee.upsert({
    where: { email },
    update: {
      password: hashedPassword,
      status: 'ACTIVE',
      roles: ['SUPER_ADMIN', 'WAREHOUSE_MANAGER', 'PROCUREMENT_OFFICER'],
    },
    create: {
      id: 'FRZ_EMP_101',
      name: 'Super Admin',
      email,
      phone: '9999999999',
      password: hashedPassword,
      roles: ['SUPER_ADMIN', 'WAREHOUSE_MANAGER', 'PROCUREMENT_OFFICER'],
      assignedWarehouseId: 'ALL',
      status: 'ACTIVE',
    },
  });

  console.log('==================================================');
  console.log('✅ SUPER ADMIN PASSWORD SUCCESSFULLY UPDATED!');
  console.log(`👤 Email:    ${employee.email}`);
  console.log(`🔑 Password: ${newPassword}`);
  console.log(`🛡️  Roles:    ${JSON.stringify(employee.roles)}`);
  console.log(`🏢 Hub:      ${employee.assignedWarehouseId}`);
  console.log('==================================================');
}

main()
  .catch((e) => {
    console.error('Failed to reset password:', e.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

