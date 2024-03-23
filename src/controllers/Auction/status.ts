import { Request, Response } from "express";
import { auctionStatus } from "../../auctionContract/auctionStatus";
import { convertBigIntToString } from "../../utils";

const status = async (req: Request, res: Response) => {
  try {
    const status = await auctionStatus();

    res.status(200).json({
      message: "Auction status",
      data: convertBigIntToString(status),
    });
  } catch (error) {
    console.error("Error getting auction status:", error);
    res.status(500).json({ message: "Error getting auction status", error });
  }
};

export default status;
