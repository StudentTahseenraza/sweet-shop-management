import { authService } from '../../../services/auth.service';
import prisma from '../../../config/database';
import bcrypt from 'bcryptjs';

describe('AuthService', () => {
  beforeEach(async () => {
    await prisma.user.deleteMany();
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      };

      const result = await authService.register(userData);

      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('token');
      expect(result.user.email).toBe(userData.email);
      expect(result.user.name).toBe(userData.name);
    });

    it('should throw error if email already exists', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      };

      await authService.register(userData);

      await expect(authService.register(userData)).rejects.toThrow(
        'User with this email already exists'
      );
    });
  });

  describe('login', () => {
    it('should login existing user', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      };

      await authService.register(userData);

      const result = await authService.login({
        email: userData.email,
        password: userData.password,
      });

      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('token');
      expect(result.user.email).toBe(userData.email);
    });

    it('should throw error for invalid credentials', async () => {
      await expect(
        authService.login({
          email: 'nonexistent@example.com',
          password: 'password123',
        })
      ).rejects.toThrow('Invalid credentials');
    });
  });
});