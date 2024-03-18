import { getWeb3Account } from "./contract";

export namespace Statistics {
  export type TotalBids = {
    totalBids: number;
  };

  export type TotalEthVolume = {
    totalEthVolume: number;
  };
}

export const statisticsFn = async () => {
  const { contract } = getWeb3Account();

  try {
    const { totalBids } = (await contract.methods
      .getTotalBids()
      .call()) as Statistics.TotalBids;

    const { totalEthVolume } = (await contract.methods
      .getEthVolume()
      .call()) as Statistics.TotalEthVolume;

    return {
      totalBids,
      totalEthVolume,
    };
  } catch (error) {
    throw error;
  }
};
