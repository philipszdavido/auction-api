import express from "express";
import { verifyTokenMiddleware } from "../middlewares/authMiddleware";
import {
  submitBid,
  status,
  statistics,
  deploy,
  history,
} from "../controllers/Auction";

const router = express.Router();

router.get("/status", verifyTokenMiddleware, status);
router.get("/history", verifyTokenMiddleware, history);
router.post("/submit-bid", verifyTokenMiddleware, submitBid);
router.get("/statistics", verifyTokenMiddleware, statistics);
router.post("/deploy", verifyTokenMiddleware, deploy);
export default router;
