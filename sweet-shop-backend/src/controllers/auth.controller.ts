import { Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { registerSchema, loginSchema } from '../utils/validators';
import { errorHandler } from '../utils/errorHandler';

export class AuthController {
  /**
   * Register new user
   */
  async register(req: Request, res: Response): Promise<void> {
    try {
      // Validate request body
      const validatedData = registerSchema.parse(req.body);

      // Register user
      const result = await authService.register(validatedData);

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: result,
      });
    } catch (error) {
      errorHandler(error, res);
    }
  }

  /**
   * Login user
   */
  async login(req: Request, res: Response): Promise<void> {
    try {
      // Validate request body
      const validatedData = loginSchema.parse(req.body);

      // Login user
      const result = await authService.login(validatedData);

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: result,
      });
    } catch (error) {
      errorHandler(error, res);
    }
  }

  /**
   * Get user profile
   */
  async getProfile(req: Request, res: Response): Promise<void> {
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

      const user = await authService.getProfile(userId);

      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      errorHandler(error, res);
    }
  }

  /**
   * Verify token
   */
  async verifyToken(req: Request, res: Response): Promise<void> {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');

      if (!token) {
        res.status(401).json({
          success: false,
          message: 'No token provided',
        });
        return;
      }

      const payload = authService.verifyToken(token);

      res.status(200).json({
        success: true,
        data: payload,
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: 'Invalid token',
      });
    }
  }
}

export const authController = new AuthController();