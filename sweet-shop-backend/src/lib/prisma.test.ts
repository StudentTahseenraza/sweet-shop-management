import { PrismaClient } from '@prisma/client';

// Create a test-specific Prisma client that uses SQLite
const createTestPrismaClient = () => {
  if (process.env.NODE_ENV !== 'test') {
    throw new Error('Test Prisma client can only be used in test environment');
  }

  return new PrismaClient({
    datasources: {
      db: {
        url: process.env.TEST_DATABASE_URL
      }
    },
    log: process.env.NODE_ENV === 'test' ? ['error'] : [],
  });
};

// Export a singleton instance for tests
const globalForPrisma = global as unknown as { 
  testPrisma: ReturnType<typeof createTestPrismaClient> 
};

export const testPrisma = globalForPrisma.testPrisma || createTestPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.testPrisma = testPrisma;
}

export default testPrisma;