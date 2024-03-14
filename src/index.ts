import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { create, find } from "./mock/user.db";
import { signToken } from "./utils/auth";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  express.json({
    type: ["application/json", "text/plain"],
  })
);

app.post("/register", async (req, res) => {
  console.log(req.body);

  const { username, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    create(username, hashedPassword);

    const token = signToken({ username, password });

    res.status(200).json({ token });
  } catch (error) {
    res.status(201).json({ message: "Invalid username or password" });
  }
});

app.post("/login", (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const user = find(username);

    if (user && user.hashPassword === password) {
      const token = signToken({ username, password });

      return res.json({ token });
    }

    return res.status(200).json({ message: "Invalid username or password" });
  } catch (error) {
    return res.status(201).json({ message: "Invalid username or password" });
  }
});

app.post("/logout", (req, res) => {
  res.json({ message: "Logout success" });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
