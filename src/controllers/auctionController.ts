import { Request, Response } from "express";

export const status = (req: Request, res: Response) => {
  res.json({ message: "Status" });
};

export const history = async (req: Request, res: Response) => {
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

export const submitBid = async (req: Request, res: Response) => {
  const { bid } = req.body;
  try {
    const txnReceipt = await submitBidAuction(bid);

    const data = convertBigIntToString(txnReceipt);

    res.status(200).json({
      message: "Bid submitted successfully",
      data,
    });
  } catch (error) {
    console.error("Error submitting bid:", error);
    res.status(500).json({ message: "Error submitting bid", error });
  }
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
