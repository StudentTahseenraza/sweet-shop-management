import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/database';
import { jwtConfig } from '../config/jwt';
import {
  IUser,
  IUserCreate,
  IUserLogin,
  IAuthResponse,
  IJWTPayload,
} from '../types/user.types';

export class AuthService {
  /**
   * Register a new user
   */
  async register(userData: IUserCreate): Promise<IAuthResponse> {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email },
    });

    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: userData.email,
        password: hashedPassword,
        name: userData.name,
        role: userData.email === process.env.ADMIN_EMAIL ? 'ADMIN' : 'CUSTOMER',
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Generate JWT token
    const token = this.generateToken(user);

    return { user, token };
  }

  /**
   * Login user
   */
  async login(loginData: IUserLogin): Promise<IAuthResponse> {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email: loginData.email },
    });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(loginData.password, user.password);

    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    // Generate JWT token
    const token = this.generateToken(user);

    // Return user without password
    const { password, ...userWithoutPassword } = user;

    return { 
      user: userWithoutPassword as IUser, 
      token 
    };
  }

  /**
   * Get user profile
   */
  async getProfile(userId: string): Promise<IUser | null> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  }

  /**
   * Generate JWT token
   */
  private generateToken(user: any): string {
    const payload: IJWTPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    // Make sure secret is defined
    const secret = jwtConfig.secret;
    if (!secret) {
      throw new Error('JWT secret is not configured');
    }

    return jwt.sign(payload, secret, {
      expiresIn: jwtConfig.expiresIn as jwt.SignOptions['expiresIn'],
    });
  }

  /**
   * Verify JWT token
   */
  verifyToken(token: string): IJWTPayload {
    try {
      const secret = jwtConfig.secret;
      if (!secret) {
        throw new Error('JWT secret is not configured');
      }
      
      return jwt.verify(token, secret) as IJWTPayload;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}

export const authService = new AuthService();