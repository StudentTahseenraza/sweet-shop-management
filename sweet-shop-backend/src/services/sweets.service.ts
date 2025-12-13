import prisma from '../config/database';
import {
  ISweet,
  ISweetCreate,
  ISweetUpdate,
  ISearchParams,
} from '../types/sweet.types';

export class SweetsService {
  /**
   * Create a new sweet
   */
  async createSweet(sweetData: ISweetCreate): Promise<ISweet> {
    // Check if sweet with same name exists
    const existingSweet = await prisma.sweet.findUnique({
      where: { name: sweetData.name },
    });

    if (existingSweet) {
      throw new Error('Sweet with this name already exists');
    }

    // Create sweet
    const sweet = await prisma.sweet.create({
      data: sweetData,
    });

    return sweet;
  }

  /**
   * Get all sweets
   */
  async getAllSweets(): Promise<ISweet[]> {
    const sweets = await prisma.sweet.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });

    return sweets;
  }

  /**
   * Get sweet by ID
   */
  async getSweetById(id: string): Promise<ISweet | null> {
    const sweet = await prisma.sweet.findUnique({
      where: { id },
    });

    return sweet;
  }

  /**
   * Search sweets with filters
   */
  async searchSweets(params: ISearchParams): Promise<ISweet[]> {
    const { name, category, minPrice, maxPrice, inStock } = params;

    const whereClause: any = { isActive: true };

    if (name) {
      whereClause.name = {
        contains: name,
        mode: 'insensitive' as any,
      };
    }

    if (category) {
      whereClause.category = {
        contains: category,
        mode: 'insensitive' as any,
      };
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      whereClause.price = {};
      if (minPrice !== undefined) whereClause.price.gte = minPrice;
      if (maxPrice !== undefined) whereClause.price.lte = maxPrice;
    }

    if (inStock !== undefined) {
      if (inStock) {
        whereClause.quantity = { gt: 0 };
      } else {
        whereClause.quantity = { equals: 0 };
      }
    }

    const sweets = await prisma.sweet.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
    });

    return sweets;
  }

  /**
   * Update sweet
   */
  async updateSweet(id: string, sweetData: ISweetUpdate): Promise<ISweet> {
    // Check if sweet exists
    const existingSweet = await prisma.sweet.findUnique({
      where: { id },
    });

    if (!existingSweet) {
      throw new Error('Sweet not found');
    }

    // Check if name is being changed and if new name already exists
    if (sweetData.name && sweetData.name !== existingSweet.name) {
      const sweetWithSameName = await prisma.sweet.findUnique({
        where: { name: sweetData.name },
      });

      if (sweetWithSameName) {
        throw new Error('Sweet with this name already exists');
      }
    }

    // Update sweet
    const updatedSweet = await prisma.sweet.update({
      where: { id },
      data: sweetData,
    });

    return updatedSweet;
  }

  /**
   * Delete sweet (soft delete)
   */
  async deleteSweet(id: string): Promise<void> {
    // Check if sweet exists
    const existingSweet = await prisma.sweet.findUnique({
      where: { id },
    });

    if (!existingSweet) {
      throw new Error('Sweet not found');
    }

    // Soft delete by setting isActive to false
    await prisma.sweet.update({
      where: { id },
      data: { isActive: false },
    });
  }

  /**
   * Get sweet categories
   */
  async getCategories(): Promise<string[]> {
    const categories = await prisma.sweet.findMany({
      distinct: ['category'],
      select: { category: true },
      where: { isActive: true },
    });

    return categories.map(cat => cat.category);
  }
}

export const sweetsService = new SweetsService();