import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const sweetCreateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
  category: z.string().min(2, 'Category must be at least 2 characters'),
  price: z.number().positive('Price must be positive'),
  quantity: z.number().int().nonnegative('Quantity cannot be negative'),
  imageUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
});

export const sweetUpdateSchema = sweetCreateSchema.partial();

export const purchaseSchema = z.object({
  quantity: z.number().int().positive('Quantity must be positive'),
});

export const restockSchema = z.object({
  quantity: z.number().int().positive('Quantity must be positive'),
});

export const searchSchema = z.object({
  name: z.string().optional(),
  category: z.string().optional(),
  minPrice: z.preprocess(
    (val) => (val ? Number(val) : undefined),
    z.number().positive().optional()
  ),
  maxPrice: z.preprocess(
    (val) => (val ? Number(val) : undefined),
    z.number().positive().optional()
  ),
  inStock: z.preprocess(
    (val) => (val === 'true' ? true : val === 'false' ? false : undefined),
    z.boolean().optional()
  ),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type SweetCreateInput = z.infer<typeof sweetCreateSchema>;
export type SweetUpdateInput = z.infer<typeof sweetUpdateSchema>;
export type PurchaseInput = z.infer<typeof purchaseSchema>;
export type RestockInput = z.infer<typeof restockSchema>;
export type SearchInput = z.infer<typeof searchSchema>;