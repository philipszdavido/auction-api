import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { User, create, find } from "./mock/user.db";
import { comparePassword, hashPassword, signToken } from "./utils/auth";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  if (find(username)) {
    return res.status(201).json({ message: "Invalid username" });
  }

  try {
    const hashedPassword = await hashPassword(password);

    create(username, hashedPassword);

    const token = signToken({ username, password });

    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(201).json({ message: "Invalid username or password" });
  }
});

app.post("/login", async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const user = find(username) as User;

    if (!user) {
      return res.status(201).json({ message: "Invalid username" });
    }

    const passwordMatch = await comparePassword(password, user.hashPassword);

    if (!passwordMatch) {
      return res.status(201).json({ message: "Wrong password" });
    }

    const token = signToken({ username, password });

    return res.json({ token });
  } catch (error) {
    console.error(error);
    return res.status(201).json({ message: "Login failed" });
  }
});

app.post("/logout", (req: Request, res: Response) => {
  res.json({ message: "Logout success" });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
