import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { getDb } from './db.js';

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = '24h';

export class AuthService {
  /**
   * Register a new user
   */
  static async register(userData) {
    const { name, email, password, role = 'VIEWER' } = userData;

    // Check if user already exists
    const existingUser = await getDb().member.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await getDb().member.create({
      data: {
        id: crypto.randomUUID(),
        name,
        email,
        role,
        password: hashedPassword,
        avatarColor: '#' + Math.floor(Math.random() * 16777215).toString(16),
        initials: name
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2),
        joinedAt: new Date().toISOString(),
      },
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
    const user = await getDb().member.findUnique({
      where: { email },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
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
    const user = await getDb().member.findUnique({
      where: { id },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Get all users
   */
  static async getAllUsers() {
    const users = await getDb().member.findMany({
      orderBy: { joinedAt: 'desc' },
    });

    return users.map((user) => {
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
  }

  /**
   * Update user role
   */
  static async updateUserRole(userId, role) {
    const user = await getDb().member.update({
      where: { id: userId },
      data: { role },
    });

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Delete user
   */
  static async deleteUser(userId) {
    await getDb().member.delete({
      where: { id: userId },
    });
    return { success: true };
  }
}
