import { Request, Response } from 'express';
import { sweetsService } from '../services/sweets.service';
import { 
  sweetCreateSchema, 
  sweetUpdateSchema, 
  searchSchema 
} from '../utils/validators';
import { errorHandler } from '../utils/errorHandler';

export class SweetsController {
  async createSweet(req: Request, res: Response): Promise<void> {
    try {
      const validatedData = sweetCreateSchema.parse(req.body);
      const sweet = await sweetsService.createSweet(validatedData);

      res.status(201).json({
        success: true,
        message: 'Sweet created successfully',
        data: sweet,
      });
    } catch (error) {
      errorHandler(error, res);
    }
  }

  async getAllSweets(_: Request, res: Response): Promise<void> {
    try {
      const sweets = await sweetsService.getAllSweets();

      res.status(200).json({
        success: true,
        count: sweets.length,
        data: sweets,
      });
    } catch (error) {
      errorHandler(error, res);
    }
  }

  async getSweetById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const sweet = await sweetsService.getSweetById(id);

      if (!sweet) {
        res.status(404).json({
          success: false,
          message: 'Sweet not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: sweet,
      });
    } catch (error) {
      errorHandler(error, res);
    }
  }

  async searchSweets(req: Request, res: Response): Promise<void> {
    try {
      const validatedParams = searchSchema.parse(req.query);
      const sweets = await sweetsService.searchSweets(validatedParams);

      res.status(200).json({
        success: true,
        count: sweets.length,
        data: sweets,
      });
    } catch (error) {
      errorHandler(error, res);
    }
  }

  async updateSweet(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const validatedData = sweetUpdateSchema.parse(req.body);
      const sweet = await sweetsService.updateSweet(id, validatedData);

      res.status(200).json({
        success: true,
        message: 'Sweet updated successfully',
        data: sweet,
      });
    } catch (error) {
      errorHandler(error, res);
    }
  }

  async deleteSweet(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await sweetsService.deleteSweet(id);

      res.status(200).json({
        success: true,
        message: 'Sweet deleted successfully',
      });
    } catch (error) {
      errorHandler(error, res);
    }
  }

  async getCategories(_: Request, res: Response): Promise<void> {
    try {
      const categories = await sweetsService.getCategories();

      res.status(200).json({
        success: true,
        count: categories.length,
        data: categories,
      });
    } catch (error) {
      errorHandler(error, res);
    }
  }
}

export const sweetsController = new SweetsController();