import { bidHistory } from "../../auctionContract/bidHistory";
import { convertBigIntToString } from "../../utils";
import { Request, Response } from "express";

const history = async (req: Request, res: Response) => {
  try {
    const history = await bidHistory();

    res.status(200).json({
      message: "Bid history",
      data: convertBigIntToString(history),
    });
  } catch (error) {
    console.error("Error getting bid history:", error);
    res.status(500).json({ message: "Error getting bid history", error });
  }
};

export default history;
