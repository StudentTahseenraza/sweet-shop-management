import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const sweetCreateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
  category: z.string().min(2, 'Category must be at least 2 characters'),
  price: z.number().positive('Price must be positive'),
  quantity: z.number().int().nonnegative('Quantity must be non-negative'),
  imageUrl: z.string().url('Invalid URL').optional(),
});

export const sweetUpdateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  description: z.string().optional(),
  category: z.string().min(2, 'Category must be at least 2 characters').optional(),
  price: z.number().positive('Price must be positive').optional(),
  quantity: z.number().int().nonnegative('Quantity must be non-negative').optional(),
  imageUrl: z.string().url('Invalid URL').optional(),
  isActive: z.boolean().optional(),
});

export const searchSchema = z.object({
  name: z.string().optional(),
  category: z.string().optional(),
  minPrice: z.string().transform(val => parseFloat(val)).pipe(z.number().optional()).optional(),
  maxPrice: z.string().transform(val => parseFloat(val)).pipe(z.number().optional()).optional(),
  inStock: z.string().transform(val => val === 'true').optional(),
});

export const purchaseSchema = z.object({
  quantity: z.number().int().positive('Quantity must be positive'),
});

export const restockSchema = z.object({
  quantity: z.number().int().positive('Quantity must be positive'),
});