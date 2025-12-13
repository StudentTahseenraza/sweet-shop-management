import * as dotenv from 'dotenv';

dotenv.config();

export const jwtConfig = {
  secret: process.env.JWT_SECRET || 'your-fallback-secret-key-change-in-production',
  expiresIn: process.env.JWT_EXPIRES_IN || '24h',
};

// Make sure secret is not undefined
if (!jwtConfig.secret || jwtConfig.secret === 'your-fallback-secret-key-change-in-production') {
  console.warn('⚠️  WARNING: Using default JWT secret. Change JWT_SECRET in .env for production!');
}