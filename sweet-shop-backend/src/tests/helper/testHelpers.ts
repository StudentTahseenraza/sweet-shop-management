import { prisma } from '../../lib/prisma';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

// Helper to create test user
export const createTestUser = async (userData: {
  email: string;
  password?: string;
  name: string;
  role?: string;
}) => {
  const hashedPassword = await bcrypt.hash(userData.password || 'password123', 10);
  const userId = uuidv4();
  
  return await prisma.user.create({
    data: {
      id: userId,
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
  const sweetId = uuidv4();
  
  return await prisma.sweet.create({
    data: {
      id: sweetId,
      name: sweetData.name,
      description: sweetData.description || 'Test description',
      category: sweetData.category,
      price: sweetData.price,
      quantity: sweetData.quantity,
      imageUrl: sweetData.imageUrl || null,
    },
  });
};

// Helper to clear all test data
export const clearTestDatabase = async () => {
  await prisma.$executeRaw`DELETE FROM restocks`;
  await prisma.$executeRaw`DELETE FROM purchases`;
  await prisma.$executeRaw`DELETE FROM sweets`;
  await prisma.$executeRaw`DELETE FROM users`;
  await prisma.$executeRaw`DELETE FROM sqlite_sequence WHERE name IN ('users', 'sweets', 'purchases', 'restocks')`;
};