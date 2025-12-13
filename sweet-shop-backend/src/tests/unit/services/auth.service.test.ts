import { AuthService } from '../../../services/auth.service';
import { prisma } from '../../../lib/prisma';
import bcrypt from 'bcryptjs';

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(async () => {
    authService = new AuthService();
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };

      const result = await authService.register(userData);

      expect(result).toHaveProperty('token');
      expect(result.user.email).toBe(userData.email);
    });
  });
});