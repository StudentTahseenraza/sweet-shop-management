import prisma from '../config/database';
import {
  IInventoryOperation,
  ISweet,
} from '../types/sweet.types';

export class InventoryService {
  async purchaseSweet(operation: IInventoryOperation): Promise<ISweet> {
    const { sweetId, userId, quantity } = operation;

    const sweet = await prisma.sweet.findUnique({
      where: { id: sweetId, isActive: true },
    });

    if (!sweet) {
      throw new Error('Sweet not found or inactive');
    }

    if (sweet.quantity < quantity) {
      throw new Error(`Insufficient stock. Available: ${sweet.quantity}`);
    }

    const result = await prisma.$transaction(async (tx) => {
      const updatedSweet = await tx.sweet.update({
        where: { id: sweetId },
        data: {
          quantity: { decrement: quantity },
        },
      });

      await tx.purchase.create({
        data: {
          sweetId,
          userId,
          quantity,
          totalPrice: quantity * sweet.price,
        },
      });

      return updatedSweet;
    });

    return {
      ...result,
      createdAt: result.createdAt.toISOString(),
      updatedAt: result.updatedAt.toISOString()
    };
  }

  async restockSweet(operation: IInventoryOperation): Promise<ISweet> {
    const { sweetId, userId, quantity } = operation;

    const sweet = await prisma.sweet.findUnique({
      where: { id: sweetId, isActive: true },
    });

    if (!sweet) {
      throw new Error('Sweet not found or inactive');
    }

    const result = await prisma.$transaction(async (tx) => {
      const updatedSweet = await tx.sweet.update({
        where: { id: sweetId },
        data: {
          quantity: { increment: quantity },
        },
      });

      await tx.restock.create({
        data: {
          sweetId,
          userId,
          quantity,
        },
      });

      return updatedSweet;
    });

    return {
      ...result,
      createdAt: result.createdAt.toISOString(),
      updatedAt: result.updatedAt.toISOString()
    };
  }

  async getUserPurchaseHistory(userId: string) {
    const purchases = await prisma.purchase.findMany({
      where: { userId },
      include: { 
        sweet: true 
      },
      orderBy: { createdAt: 'desc' },
    });

    return purchases.map(purchase => ({
      ...purchase,
      createdAt: purchase.createdAt.toISOString(),
      sweet: purchase.sweet ? {
        ...purchase.sweet,
        createdAt: purchase.sweet.createdAt.toISOString(),
        updatedAt: purchase.sweet.updatedAt.toISOString()
      } : null
    }));
  }

  async getSweetRestockHistory(sweetId: string) {
    const restocks = await prisma.restock.findMany({
      where: { sweetId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return restocks.map(restock => ({
      ...restock,
      createdAt: restock.createdAt.toISOString()
    }));
  }

  async getLowStockSweets(threshold: number = 10): Promise<ISweet[]> {
    const lowStockSweets = await prisma.sweet.findMany({
      where: {
        isActive: true,
        quantity: { lte: threshold },
      },
      orderBy: { quantity: 'asc' },
    });

    return lowStockSweets.map(sweet => ({
      ...sweet,
      createdAt: sweet.createdAt.toISOString(),
      updatedAt: sweet.updatedAt.toISOString()
    }));
  }
}

export const inventoryService = new InventoryService();