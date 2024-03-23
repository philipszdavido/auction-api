import { Request, Response } from "express";
import { deployEndpoint } from "../../auctionContract/deployEndpoint";

const deploy = async (req: Request, res: Response) => {
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

export default deploy;
