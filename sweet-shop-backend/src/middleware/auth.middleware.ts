import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import { IJWTPayload } from '../types/user.types';

declare global {
  namespace Express {
    interface Request {
      user?: IJWTPayload;
    }
  }
}

/**
 * Authentication middleware
 */
export const authenticate = async(
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided or invalid format',
      });
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = authService.verifyToken(token);

    // Attach user to request
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
    });
  }
};

/**
 * Check if user is authenticated (optional)
 */
export const optionalAuthenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = authService.verifyToken(token);
      req.user = decoded;
    }

    next();
  } catch (error) {
    // If token is invalid, continue without authentication
    next();
  }
};