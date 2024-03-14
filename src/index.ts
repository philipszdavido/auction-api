import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { User, create, find } from "./mock/user.db";
import { comparePassword, hashPassword, signToken } from "./utils/auth";
import authRoutes from "./routes/authRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
