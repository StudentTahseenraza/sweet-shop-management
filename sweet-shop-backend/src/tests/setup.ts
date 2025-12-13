import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.test' });

const prisma = new PrismaClient();

// Global test setup
beforeAll(async () => {
  // Connect to test database
  await prisma.$connect();
  
  // Clear test database
  await prisma.restock.deleteMany();
  await prisma.purchase.deleteMany();
  await prisma.sweet.deleteMany();
  await prisma.user.deleteMany();
});

// Global test teardown
afterAll(async () => {
  await prisma.$disconnect();
});

// Clean up after each test
afterEach(async () => {
  await prisma.restock.deleteMany();
  await prisma.purchase.deleteMany();
  await prisma.sweet.deleteMany();
  await prisma.user.deleteMany();
});