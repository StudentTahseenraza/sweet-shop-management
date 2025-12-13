import { Request, Response, NextFunction } from 'express';

/**
 * Admin role middleware
 */
export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    // Changed from UserRole.ADMIN to string 'ADMIN'
    if (user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required',
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

/**
 * Check if user is admin (for conditional logic)
 */
export const isAdmin = (req: Request): boolean => {
  return req.user?.role === 'ADMIN';
};