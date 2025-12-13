import { prisma } from '../../lib/prisma';
import bcrypt from 'bcryptjs';

export const seedTestDatabase = async () => {
  // Clear existing data
  await prisma.restock.deleteMany();
  await prisma.purchase.deleteMany();
  await prisma.sweet.deleteMany();
  await prisma.user.deleteMany();

  // Create test users
  const adminPassword = await bcrypt.hash('password123', 10);
  const userPassword = await bcrypt.hash('password123', 10);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@test.com',
      password: adminPassword,
      name: 'Test Admin',
      role: 'ADMIN',
    },
  });

  const customer = await prisma.user.create({
    data: {
      email: 'customer@test.com',
      password: userPassword,
      name: 'Test Customer',
      role: 'CUSTOMER',
    },
  });

  // Create test sweets
  const sweets = await prisma.sweet.createMany({
    data: [
      {
        name: 'Test Chocolate Truffles',
        description: 'Test description',
        category: 'Chocolate',
        price: 24.99,
        quantity: 85,
      },
      {
        name: 'Test Chocolate Bar',
        description: 'Test description',
        category: 'Chocolate',
        price: 18.50,
        quantity: 120,
      },
    ],
  });

  return { admin, customer };
};