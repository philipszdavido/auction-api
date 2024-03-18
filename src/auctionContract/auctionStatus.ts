import web3 from "web3";
import { getWeb3Account } from "./contract";

export type AuctionStatus = {
  ended: boolean;
  beneficiary: string;
  pendingReturns: bigint;
  highestBid: bigint;
  auctionEndTime: bigint;
  highestBidder: string;
};

export const auctionStatus = async () => {
  const { contract } = getWeb3Account();

  try {
    const status = (await contract.methods.getStatus().call()) as AuctionStatus;

    console.log(status);

    const { ended, beneficiary, pendingReturns, highestBid, auctionEndTime } =
      status;

    return {
      ended,
      beneficiary,
      pendingReturns,
      highestBid,
      auctionEndTime,
    };
  } catch (error) {
    throw error;
  }
};
