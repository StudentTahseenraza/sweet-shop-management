import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
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
  async register(userData: IUserCreate): Promise<IAuthResponse> {
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email },
    });

    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

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

    const token = this.generateToken(user);

    return { 
      user: {
        ...user,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString()
      }, 
      token 
    };
  }

  async login(loginData: IUserLogin): Promise<IAuthResponse> {
    const user = await prisma.user.findUnique({
      where: { email: loginData.email },
    });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(loginData.password, user.password);

    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    const token = this.generateToken(user);
    const { password, ...userWithoutPassword } = user;

    return { 
      user: {
        ...userWithoutPassword,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString()
      } as IUser, 
      token 
    };
  }

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

    if (!user) return null;

    return {
      ...user,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString()
    };
  }

  private generateToken(user: any): string {
    const payload: IJWTPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const secret = jwtConfig.secret;
    if (!secret) {
      throw new Error('JWT secret is not configured');
    }

    return jwt.sign(payload, secret, {
      expiresIn: jwtConfig.expiresIn as jwt.SignOptions['expiresIn'],
    });
  }

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