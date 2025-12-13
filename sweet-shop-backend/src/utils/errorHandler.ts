import { Response } from 'express';

/**
 * Global error handler utility
 */
export const errorHandler = (error: any, res: Response): void => {
  console.error('Error:', error);

  // Handle validation errors
  if (error.name === 'ZodError') {
    const errors = error.errors?.map((err: any) => ({
      field: err.path?.join('.') || '',
      message: err.message || 'Validation error',
    })) || [];

    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
    return;
  }

  // Handle custom errors
  if (error.message) {
    const statusCode = 
      error.message.includes('not found') ? 404 :
      error.message.includes('already exists') ? 409 :
      error.message.includes('Invalid') ? 401 :
      error.message.includes('Insufficient') ? 400 :
      500;

    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
    return;
  }

  // Handle unexpected errors
  res.status(500).json({
    success: false,
    message: 'Internal server error',
  });
};