import { getWeb3Account } from "./contract";

export type AuctionHistory = {
  bidder: string;
  amount: bigint;
};

export const bidHistory = async () => {
  const { contract } = getWeb3Account();

  try {
    const history = (await contract.methods
      .getBidHistory()
      .call()) as AuctionHistory;

    const historyMapped: AuctionHistory = {
      bidder: history?.bidder,
      amount: history.amount,
    };

    return historyMapped;
  } catch (error) {
    throw error;
  }
};
