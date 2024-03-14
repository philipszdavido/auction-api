import express from "express";
import {
  submitBid,
  status,
  history,
  statistics,
} from "../controllers/auctionController";
const router = express.Router();

router.get("/status", status);
router.get("/history", history);
router.post("/submit-bid", submitBid);
router.get("statistics", statistics);
export default router;
