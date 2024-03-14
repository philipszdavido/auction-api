import { find, create, User } from "../mock/user.db";
import { comparePassword, hashPassword, signToken } from "../utils/auth";
import { Request, Response } from "express";

export const register = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (find(username)) {
    return res.status(400).json({ message: "Invalid username" });
  }

  try {
    const hashedPassword = await hashPassword(password);

    create(username, hashedPassword);

    // const token = signToken({ username, password });

    // res.status(200).json({ token });
    res.status(200).json({ message: "User created" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Invalid username or password" });
  }
};

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const user = find(username) as User;

    if (!user) {
      return res.status(400).json({ message: "Invalid username" });
    }

    const passwordMatch = await comparePassword(password, user.hashPassword);

    if (!passwordMatch) {
      return res.status(400).json({ message: "Wrong password" });
    }

    const token = signToken({ username, password });

    return res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: "Login failed" });
  }
};

export const logout = (req: Request, res: Response) => {
  res.json({ message: "Logout success" });
};
