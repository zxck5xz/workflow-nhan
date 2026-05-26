import 'dotenv/config';
import { PrismaClient } from './src/generated/client';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcrypt';

let prisma = null;

function getPrisma() {
  if (prisma) return prisma;
  prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
  });
  return prisma;
}

async function main() {
  console.log('Starting to seed users...');
  
  // Hash password for default users
  const passwordHash = await bcrypt.hash('admin123', 10);
  
  // Create admin user if doesn't exist
  const adminExists = await getPrisma().member.findUnique({
    where: { email: 'admin@workflow-nhan.com' }
  });
  
  if (!adminExists) {
    await getPrisma().member.create({
      data: {
        name: 'Admin User',
        email: 'admin@workflow-nhan.com',
        role: 'ADMIN',
        password: passwordHash,
        avatarColor: '#FF5733',
        initials: 'AU',
        joinedAt: new Date().toISOString()
      }
    });
    console.log('Admin user created');
  } else {
    console.log('Admin user already exists');
  }
  
  // Create manager user if doesn't exist
  const managerExists = await getPrisma().member.findUnique({
    where: { email: 'manager@workflow-nhan.com' }
  });
  
  if (!managerExists) {
    await getPrisma().member.create({
      data: {
        name: 'Manager User',
        email: 'manager@workflow-nhan.com',
        role: 'MANAGER',
        password: passwordHash,
        avatarColor: '#33FF57',
        initials: 'MU',
        joinedAt: new Date().toISOString()
      }
    });
    console.log('Manager user created');
  } else {
    console.log('Manager user already exists');
  }
  
  // Create tester user if doesn't exist
  const testerExists = await getPrisma().member.findUnique({
    where: { email: 'tester@workflow-nhan.com' }
  });
  
  if (!testerExists) {
    await getPrisma().member.create({
      data: {
        name: 'Tester User',
        email: 'tester@workflow-nhan.com',
        role: 'TESTER',
        password: passwordHash,
        avatarColor: '#3357FF',
        initials: 'TU',
        joinedAt: new Date().toISOString()
      }
    });
    console.log('Tester user created');
  } else {
    console.log('Tester user already exists');
  }
  
  // Create viewer user if doesn't exist
  const viewerExists = await getPrisma().member.findUnique({
    where: { email: 'viewer@workflow-nhan.com' }
  });
  
  if (!viewerExists) {
    await getPrisma().member.create({
      data: {
        name: 'Viewer User',
        email: 'viewer@workflow-nhan.com',
        role: 'VIEWER',
        password: passwordHash,
        avatarColor: '#FF33F5',
        initials: 'VU',
        joinedAt: new Date().toISOString()
      }
    });
    console.log('Viewer user created');
  } else {
    console.log('Viewer user already exists');
  }
  
  console.log('User seeding completed');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await getPrisma().$disconnect();
  });