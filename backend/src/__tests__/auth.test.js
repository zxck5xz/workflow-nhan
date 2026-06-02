import { describe, it, expect, beforeAll } from 'vitest';
import jwt from 'jsonwebtoken';

const TEST_SECRET = 'test-secret-key-not-for-production';

beforeAll(() => {
  process.env.JWT_SECRET = TEST_SECRET;
});

// Dynamic import after env is set to avoid startup check failure
let AuthService;
beforeAll(async () => {
  AuthService = (await import('../auth.js')).AuthService;
});

describe('AuthService', () => {
  it('should generate a valid token', () => {
    const user = { id: '1', email: 'test@example.com', role: 'USER' };
    const token = AuthService.generateToken(user);
    expect(token).toBeDefined();

    const decoded = jwt.verify(token, TEST_SECRET);
    expect(decoded.id).toBe(user.id);
    expect(decoded.email).toBe(user.email);
    expect(decoded.role).toBe(user.role);
  });

  it('should verify a valid token', () => {
    const user = { id: '1', email: 'test@example.com', role: 'USER' };
    const token = jwt.sign(user, TEST_SECRET);

    const payload = AuthService.verifyToken(token);
    expect(payload.id).toBe(user.id);
  });
});
