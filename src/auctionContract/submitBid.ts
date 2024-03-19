import web3 from "web3";
import { callContractMethod } from "./contract";

export async function submitBid(amountToBid: number) {
  try {
    const amount = web3.utils.toWei(amountToBid.toString(), "ether");

    const txObject = {
      value: amount,
    };

    const txReceipt = await callContractMethod("bid", txObject);

    return txReceipt;
  } catch (error) {
    throw error;
  }
}
