import { SignJWT, jwtVerify } from 'jose';
import type { Env, UserPayload } from './types';

const JWT_EXPIRY = '24h';

export async function generateToken(payload: UserPayload, secret: string): Promise<string> {
  const key = new TextEncoder().encode(secret);
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRY)
    .sign(key);
}

export async function verifyToken(
  token: string,
  secret: string,
): Promise<UserPayload> {
  const key = new TextEncoder().encode(secret);
  const { payload } = await jwtVerify(token, key);
  return {
    id: payload.id as string,
    email: payload.email as string,
    role: payload.role as string,
  };
}

export function extractTokenFromHeader(authHeader: string | null): string | null {
  if (!authHeader?.startsWith('Bearer ')) return null;
  return authHeader.slice(7);
}
