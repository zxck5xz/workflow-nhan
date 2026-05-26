import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '24h';

export class AuthService {
  /**
   * Register a new user
   */
  static async register(userData) {
    const { name, email, password, role = 'VIEWER' } = userData;
    
    // Check if user already exists
    const existingUser = await prisma.member.findUnique({
      where: { email }
    });
    
    if (existingUser) {
      throw new Error('User with this email already exists');
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const user = await prisma.member.create({
      data: {
        name,
        email,
        role,
        password: hashedPassword,
        avatarColor: '#' + Math.floor(Math.random()*16777215).toString(16),
        initials: name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
        joinedAt: new Date().toISOString()
      }
    });
    
    // Generate token
    const token = this.generateToken({ id: user.id, email: user.email, role: user.role });
    
    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  }
  
  /**
   * Login user
   */
  static async login(email, password) {
    // Find user
    const user = await prisma.member.findUnique({
      where: { email }
    });
    
    if (!user) {
      throw new Error('Invalid email or password');
    }
    
    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error('Invalid email or password');
    }
    
    // Generate token
    const token = this.generateToken({ id: user.id, email: user.email, role: user.role });
    
    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  }
  
  /**
   * Generate JWT token
   */
  static generateToken(payload) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  }
  
  /**
   * Verify JWT token
   */
  static verifyToken(token) {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }
  
  /**
   * Get user by ID
   */
  static async getUserById(id) {
    const user = await prisma.member.findUnique({
      where: { id }
    });
    
    if (!user) {
      throw new Error('User not found');
    }
    
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}