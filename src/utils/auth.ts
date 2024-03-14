import { JWT_SECRET } from "./constants";

import jsonwebtoken from "jsonwebtoken";
import bcrypt from "bcrypt";

export function signToken(payload: object | any) {
  return jsonwebtoken.sign(payload, JWT_SECRET, {
    expiresIn: "1h",
  });
}

export function verifyToken(token: string) {
  return jsonwebtoken.verify(token, JWT_SECRET);
}

export function decodeToken(token: string) {
  return jsonwebtoken.decode(token);
}

export async function hashPassword(password: string) {
  return await bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hashPassword: string) {
  return await bcrypt.compare(password, hashPassword);
}

export function logout() {}
