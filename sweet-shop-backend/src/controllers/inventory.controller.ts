import { Request, Response } from 'express';
import { inventoryService } from '../services/inventory.service';
import { purchaseSchema, restockSchema } from '../utils/validators';
import { errorHandler } from '../utils/errorHandler';

export class InventoryController {
  /**
   * Purchase sweet
   */
  async purchaseSweet(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      // @ts-ignore - user is attached by auth middleware
      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
        return;
      }

      // Validate request body
      const validatedData = purchaseSchema.parse(req.body);

      const operation = {
        sweetId: id,
        userId,
        quantity: validatedData.quantity,
      };

      const updatedSweet = await inventoryService.purchaseSweet(operation);

      res.status(200).json({
        success: true,
        message: 'Purchase successful',
        data: updatedSweet,
      });
    } catch (error) {
      errorHandler(error, res);
    }
  }

  /**
   * Restock sweet
   */
  async restockSweet(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      // @ts-ignore - user is attached by auth middleware
      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
        return;
      }

      // Validate request body
      const validatedData = restockSchema.parse(req.body);

      const operation = {
        sweetId: id,
        userId,
        quantity: validatedData.quantity,
      };

      const updatedSweet = await inventoryService.restockSweet(operation);

      res.status(200).json({
        success: true,
        message: 'Restock successful',
        data: updatedSweet,
      });
    } catch (error) {
      errorHandler(error, res);
    }
  }

  /**
   * Get purchase history
   */
  async getPurchaseHistory(req: Request, res: Response): Promise<void> {
    try {
      // @ts-ignore - user is attached by auth middleware
      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
        return;
      }

      const purchases = await inventoryService.getUserPurchaseHistory(userId);

      res.status(200).json({
        success: true,
        count: purchases.length,
        data: purchases,
      });
    } catch (error) {
      errorHandler(error, res);
    }
  }

  /**
   * Get restock history
   */
  async getRestockHistory(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const restocks = await inventoryService.getSweetRestockHistory(id);

      res.status(200).json({
        success: true,
        count: restocks.length,
        data: restocks,
      });
    } catch (error) {
      errorHandler(error, res);
    }
  }

  /**
   * Get low stock sweets
   */
  async getLowStockSweets(req: Request, res: Response): Promise<void> {
    try {
      const threshold = req.query.threshold 
        ? parseInt(req.query.threshold as string) 
        : 10;

      const lowStockSweets = await inventoryService.getLowStockSweets(threshold);

      res.status(200).json({
        success: true,
        count: lowStockSweets.length,
        threshold,
        data: lowStockSweets,
      });
    } catch (error) {
      errorHandler(error, res);
    }
  }
}

export const inventoryController = new InventoryController();