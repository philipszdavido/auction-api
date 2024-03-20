import { find, create, User } from "../mock/user.db";
import { comparePassword, hashPassword, signToken } from "../utils/auth";
import { Request, Response } from "express";

export const USERNAME_MAX_LENGTH = 15;
export const USERNAME_MIN_LENGTH = 4;

export const PASSWORD_MIN_LENGTH = 4;
export const isUsernameTooLong = (username: string) => {
  return username.length > USERNAME_MAX_LENGTH;
};

export const isPassordTooShort = (password: string) => {
  return password.length < PASSWORD_MIN_LENGTH;
};

export const register = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if ((!username && username != "") || (!password && password != "")) {
      return res.status(400).json({
        message: "No username or password found",
      });
    }

    if (username.length < USERNAME_MIN_LENGTH) {
      return res.status(400).json({
        message: `Username is too short. The minimum length is ${USERNAME_MIN_LENGTH}`,
      });
    }

    if (isUsernameTooLong(username)) {
      return res.status(400).json({
        message: `Username is too long. The maximum length is ${USERNAME_MAX_LENGTH}`,
      });
    }

    if (isPassordTooShort(password)) {
      return res.status(400).json({
        message: `Password Too Short. Minimum lenght is ${PASSWORD_MIN_LENGTH}`,
      });
    }

    if (find(username)) {
      return res.status(400).json({ message: "Username is already taken" });
    }

    const hashedPassword = await hashPassword(password.toString());

    create(username, hashedPassword);

    res.status(200).json({ message: "User created" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Invalid username or password" });
  }
};

export const login = async (req: Request, res: Response) => {
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

export const logout = (req: Request, res: Response) => {
  res.json({ message: "Logout success" });
};
