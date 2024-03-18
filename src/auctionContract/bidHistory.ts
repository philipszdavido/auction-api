import { weiToEther } from "../utils";
import { getWeb3Account } from "./contract";

export type AuctionHistory = {
  bidder: string;
  amount: bigint;
};

export type AuctionHistoryMapped = {
  bidder: string;
  amount: string;
};

export const bidHistory = async () => {
  const { contract } = getWeb3Account();

  try {
    const history = (await contract.methods
      .getBidHistory()
      .call()) as AuctionHistory[];

    const historyMapped: AuctionHistoryMapped[] = history.map((bid) => ({
      bidder: bid.bidder,
      amount: +weiToEther(bid.amount) + " ETH",
    }));

    console.log(history);

    return historyMapped;
  } catch (error) {
    throw error;
  }
};
