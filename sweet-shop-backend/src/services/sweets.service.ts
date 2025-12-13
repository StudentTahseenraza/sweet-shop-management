import prisma from '../config/database';
import {
  ISweet,
  ISweetCreate,
  ISweetUpdate,
  ISearchParams,
} from '../types/sweet.types';

export class SweetsService {
  async createSweet(sweetData: ISweetCreate): Promise<ISweet> {
    const existingSweet = await prisma.sweet.findUnique({
      where: { name: sweetData.name },
    });

    if (existingSweet) {
      throw new Error('Sweet with this name already exists');
    }

    const sweet = await prisma.sweet.create({
      data: sweetData,
    });

    return this.formatSweetDate(sweet);
  }

  async getAllSweets(): Promise<ISweet[]> {
    const sweets = await prisma.sweet.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });

    return sweets.map(sweet => this.formatSweetDate(sweet));
  }

  async getSweetById(id: string): Promise<ISweet | null> {
    const sweet = await prisma.sweet.findUnique({
      where: { id },
    });

    if (!sweet) return null;

    return this.formatSweetDate(sweet);
  }

  async searchSweets(params: ISearchParams): Promise<ISweet[]> {
    const { name, category, minPrice, maxPrice, inStock } = params;

    const whereClause: any = { isActive: true };

    if (name) {
      whereClause.name = { contains: name };
    }

    if (category) {
      whereClause.category = { contains: category };
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

    return sweets.map(sweet => this.formatSweetDate(sweet));
  }

  async updateSweet(id: string, sweetData: ISweetUpdate): Promise<ISweet> {
    const existingSweet = await prisma.sweet.findUnique({
      where: { id },
    });

    if (!existingSweet) {
      throw new Error('Sweet not found');
    }

    if (sweetData.name && sweetData.name !== existingSweet.name) {
      const sweetWithSameName = await prisma.sweet.findUnique({
        where: { name: sweetData.name },
      });

      if (sweetWithSameName) {
        throw new Error('Sweet with this name already exists');
      }
    }

    const updatedSweet = await prisma.sweet.update({
      where: { id },
      data: sweetData,
    });

    return this.formatSweetDate(updatedSweet);
  }

  async deleteSweet(id: string): Promise<void> {
    const existingSweet = await prisma.sweet.findUnique({
      where: { id },
    });

    if (!existingSweet) {
      throw new Error('Sweet not found');
    }

    await prisma.sweet.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async getCategories(): Promise<string[]> {
    const categories = await prisma.sweet.findMany({
      distinct: ['category'],
      select: { category: true },
      where: { isActive: true },
    });

    return categories.map(cat => cat.category);
  }

  private formatSweetDate(sweet: any): ISweet {
    return {
      ...sweet,
      createdAt: sweet.createdAt.toISOString(),
      updatedAt: sweet.updatedAt.toISOString()
    };
  }
}

export const sweetsService = new SweetsService();