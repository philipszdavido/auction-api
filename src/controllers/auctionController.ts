import { Request, Response } from "express";
import { submitBid as submitBidAuction } from "../auctionContract/submitBid";
import { convertBigIntToString } from "../utils";
import { auctionStatus } from "../auctionContract/auctionStatus";
import { bidHistory } from "../auctionContract/bidHistory";
import { statisticsFn } from "../auctionContract/statistics";
import { deployEndpoint } from "../auctionContract/deployEndpoint";

export const status = async (req: Request, res: Response) => {
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

export const deploy = async (req: Request, res: Response) => {
  try {
    const { endTime, beneficiaryAddress } = req.body;

    if (!endTime || !beneficiaryAddress) {
      return res.status(400).json({
        message: "endTime and beneficiaryAddress are required parameters",
      });
    }

    const deployData = await deployEndpoint({
      endTime,
      beneficiaryAddress,
    });

    res.status(200).json({
      message: "Auction smart contract deployed successfully",
      data: { auctionContractAddress: deployData },
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deploying contract",
      error,
    });
  }
};
