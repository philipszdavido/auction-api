import express from "express";
import {
  submitBid,
  status,
  history,
  statistics,
  deploy,
} from "../controllers/auctionController";
import { verifyTokenMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/status", verifyTokenMiddleware, status);
router.get("/history", verifyTokenMiddleware, history);
router.post("/submit-bid", verifyTokenMiddleware, submitBid);
router.get("/statistics", verifyTokenMiddleware, statistics);
router.post("/deploy", verifyTokenMiddleware, deploy);
export default router;
