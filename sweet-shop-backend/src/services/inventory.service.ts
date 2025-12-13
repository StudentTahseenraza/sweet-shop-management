import prisma from '../config/database';
import {
  IInventoryOperation,
  ISweet,
} from '../types/sweet.types';

export class InventoryService {
  /**
   * Purchase sweets (decrease quantity)
   */
  async purchaseSweet(operation: IInventoryOperation): Promise<ISweet> {
    const { sweetId, userId, quantity } = operation;

    // Check if sweet exists and is active
    const sweet = await prisma.sweet.findUnique({
      where: { id: sweetId, isActive: true },
    });

    if (!sweet) {
      throw new Error('Sweet not found or inactive');
    }

    // Check if enough stock is available
    if (sweet.quantity < quantity) {
      throw new Error(`Insufficient stock. Available: ${sweet.quantity}`);
    }

    // Start transaction
    return await prisma.$transaction(async (tx) => {
      // Update sweet quantity
      const updatedSweet = await tx.sweet.update({
        where: { id: sweetId },
        data: {
          quantity: {
            decrement: quantity,
          },
        },
      });

      // Create purchase record
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
  }

  /**
   * Restock sweets (increase quantity)
   */
  async restockSweet(operation: IInventoryOperation): Promise<ISweet> {
    const { sweetId, userId, quantity } = operation;

    // Check if sweet exists and is active
    const sweet = await prisma.sweet.findUnique({
      where: { id: sweetId, isActive: true },
    });

    if (!sweet) {
      throw new Error('Sweet not found or inactive');
    }

    // Start transaction
    return await prisma.$transaction(async (tx) => {
      // Update sweet quantity
      const updatedSweet = await tx.sweet.update({
        where: { id: sweetId },
        data: {
          quantity: {
            increment: quantity,
          },
        },
      });

      // Create restock record
      await tx.restock.create({
        data: {
          sweetId,
          userId,
          quantity,
        },
      });

      return updatedSweet;
    });
  }

  /**
   * Get purchase history for a user
   */
  async getUserPurchaseHistory(userId: string) {
    const purchases = await prisma.purchase.findMany({
      where: { userId },
      include: {
        sweet: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return purchases;
  }

  /**
   * Get restock history for a sweet
   */
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

    return restocks;
  }

  /**
   * Get low stock sweets (quantity <= threshold)
   */
  async getLowStockSweets(threshold: number = 10): Promise<ISweet[]> {
    const lowStockSweets = await prisma.sweet.findMany({
      where: {
        isActive: true,
        quantity: {
          lte: threshold,
        },
      },
      orderBy: { quantity: 'asc' },
    });

    return lowStockSweets;
  }
}

export const inventoryService = new InventoryService();