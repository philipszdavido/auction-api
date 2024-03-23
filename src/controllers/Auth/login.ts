import { User, find } from "../../mock/user.db";
import { comparePassword, signToken } from "../../utils/auth";
import { Request, Response } from "express";

const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

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

export default login;
