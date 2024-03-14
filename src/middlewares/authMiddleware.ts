import { NextFunction, Request, Response } from "express";
import { JWT_SECRET } from "../utils/constants";
import { verify } from "jsonwebtoken";

export function verifyTokenMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = verify(token, JWT_SECRET);
    req.body = { ...req.body, decoded };
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "Unauthorized" });
  }
}
