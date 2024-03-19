import { weiToEther } from "../utils";
import { getWeb3Account } from "./contract";

export const statisticsFn = async () => {
  const { contract } = getWeb3Account();

  try {
    const totalBids = (await contract.methods.getTotalBids().call()) as bigint;

    const totalEthVolume = (await contract.methods
      .getEthVolume()
      .call()) as bigint;

    const stats = {
      totalBids,
      totalEthVolume: weiToEther(totalEthVolume) + " ETH",
    };

    return stats;
  } catch (error) {
    throw error;
  }
};
