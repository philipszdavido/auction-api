import { User, find } from "../../db/user.db";
import { comparePassword, signToken } from "../../utils/auth";
import { Request, Response } from "express";

const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    const user = (await find(username)) as User;

    if (!user) {
      return res.status(400).json({ message: "Invalid username" });
    }

    const passwordMatch = await comparePassword(password, user.hashpassword);

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
