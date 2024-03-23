import { Request, Response } from "express";
import { convertBigIntToString } from "../../utils";
import { statisticsFn } from "../../auctionContract/statistics";

const statistics = async (req: Request, res: Response) => {
  try {
    const stats = await statisticsFn();

    res.status(200).json({
      message: "Statistics",
      data: convertBigIntToString(stats),
    });
  } catch (error) {
    console.error("Error getting statistics:", error);
    res.status(500).json({ message: "Error getting statistics", error });
  }
};

export default statistics;
