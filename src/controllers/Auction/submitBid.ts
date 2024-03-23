import { Request, Response } from "express";
import { convertBigIntToString } from "../../utils";
import { submitBid as submitBidAuction } from "../../auctionContract/submitBid";

const submitBid = async (req: Request, res: Response) => {
  const { bid } = req.body;
  try {
    if (!bid) {
      return res.status(400).json({
        message: "There is no bid amount",
      });
    }
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

export default submitBid;
