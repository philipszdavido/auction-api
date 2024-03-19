import {
  bigIntToNumber,
  unixTimestampToDateString,
  weiToEther,
} from "../utils";
import { getWeb3Account } from "./contract";

export type AuctionStatus = {
  ended: boolean;
  beneficiary: string;
  pendingReturns: bigint;
  highestBid: bigint;
  auctionEndTime: bigint;
  highestBidder: string;
  totalBids: bigint;
};

export const auctionStatus = async () => {
  const { contract } = getWeb3Account();

  try {
    const status = (await contract.methods.getStatus().call()) as AuctionStatus;

    console.log(status);

    const {
      ended,
      beneficiary,
      pendingReturns,
      highestBid,
      auctionEndTime,
      totalBids,
    } = status;

    const auctionStatus = {
      ended,
      beneficiary,
      pendingReturns: weiToEther(pendingReturns) + " ETH",
      highestBid: weiToEther(highestBid) + " ETH",
      auctionEndTime: unixTimestampToDateString(auctionEndTime),
      totalBids: bigIntToNumber(totalBids),
    };

    return auctionStatus;
  } catch (error) {
    throw error;
  }
};
