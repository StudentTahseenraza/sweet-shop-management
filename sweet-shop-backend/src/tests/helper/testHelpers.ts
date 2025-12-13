import { prisma } from '../../lib/prisma';
import bcrypt from 'bcryptjs';

// Helper to create test user
export const createTestUser = async (userData: {
  email: string;
  password?: string;
  name: string;
  role?: string;
}) => {
  const hashedPassword = await bcrypt.hash(userData.password || 'password123', 10);
  
  return await prisma.user.create({
    data: {
      email: userData.email,
      password: hashedPassword,
      name: userData.name,
      role: userData.role || 'CUSTOMER',
    },
  });
};

// Helper to create test sweet
export const createTestSweet = async (sweetData: {
  name: string;
  description?: string;
  category: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}) => {
  return await prisma.sweet.create({
    data: {
      name: sweetData.name,
      description: sweetData.description || 'Test description',
      category: sweetData.category,
      price: sweetData.price,
      quantity: sweetData.quantity,
      imageUrl: sweetData.imageUrl || null,
    },
  });
};

// Helper to clear all test data (using deleteMany instead of $executeRaw)
export const clearTestDatabase = async () => {
  // Clear in correct order to respect foreign key constraints
  await prisma.restock.deleteMany();
  await prisma.purchase.deleteMany();
  await prisma.sweet.deleteMany();
  await prisma.user.deleteMany();
};