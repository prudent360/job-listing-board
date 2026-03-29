import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { NextRequest } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret";
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN || "7d") as string & jwt.SignOptions["expiresIn"];

export type Role = "SUPER_ADMIN" | "ADMIN" | "STAFF" | "JOB_SEEKER";

export interface JwtPayload {
  userId: number;
  email: string;
  role: Role;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
}

export function getTokenFromRequest(req: NextRequest): string | null {
  const authHeader = req.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice(7);
  }
  return null;
}

export function authenticate(req: NextRequest): JwtPayload {
  const token = getTokenFromRequest(req);
  if (!token) {
    throw new Error("No token provided");
  }
  return verifyToken(token);
}

export function authorize(req: NextRequest, allowedRoles: Role[]): JwtPayload {
  const user = authenticate(req);
  if (!allowedRoles.includes(user.role)) {
    throw new Error("Insufficient permissions");
  }
  return user;
}
