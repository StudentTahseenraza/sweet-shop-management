import { prisma } from '../lib/prisma';
import fs from 'fs';
import path from 'path';

// Global test setup
beforeAll(async () => {
  // Connect to test database
  await prisma.$connect();
  
  // Clear all data before tests
  await prisma.restock.deleteMany();
  await prisma.purchase.deleteMany();
  await prisma.sweet.deleteMany();
  await prisma.user.deleteMany();
}, 30000);

// Clean up after each test
afterEach(async () => {
  await prisma.restock.deleteMany();
  await prisma.purchase.deleteMany();
  await prisma.sweet.deleteMany();
  await prisma.user.deleteMany();
});

// Global test teardown
afterAll(async () => {
  await prisma.$disconnect();
  
  // Clean up test database file for SQLite
  const testDbPath = path.join(__dirname, '../../test.db');
  if (fs.existsSync(testDbPath) && process.env.NODE_ENV === 'test') {
    try {
      fs.unlinkSync(testDbPath);
    } catch (error) {
      console.log('Could not delete test.db:', error);
    }
  }
}, 30000);