import { Request, Response } from "express";

export const status = (req: Request, res: Response) => {
  res.json({ message: "Status" });
};

export const history = (req: Request, res: Response) => {
  res.json({ message: "History" });
};

export const submitBid = (req: Request, res: Response) => {
  res.json({ message: "Submit bid" });
};

export const statistics = async (req: Request, res: Response) => {
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
