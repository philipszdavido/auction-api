import Web3, { Transaction } from "web3";
import artifacts from "../../artifacts/contracts/SimpleAuction.sol/SimpleAuction.json";
import dotenv from "dotenv";

export const getNetworkUrl = () => {
  dotenv.config();

  try {
    const network = process.env.ETHEREUM_NETWORK;

    return network as string;
  } catch (error) {
    console.error(error);
  } finally {
    return "http://localhost:8545";
  }
};

export const getWeb3Account = () => {
  const contractAddress = process.env.CONTRACT_ADDRESS;
  const signerKey = process.env.SIGNER_PRIVATE_KEY;

  const url = getNetworkUrl();

  const web3 = new Web3(url);

  const contract = new web3.eth.Contract(artifacts.abi, contractAddress);

  const signer = web3.eth.accounts.privateKeyToAccount(String(signerKey));
  web3.eth.accounts.wallet.add(signer);

  return {
    contract,
    account: signer.address,
    privateKey: signer.privateKey,
    contractAddress,
    web3,
  };
};

export const callContractMethod = async (
  contractMethodName: string,
  txObjectData: object
) => {
  const { contract, account, privateKey, contractAddress, web3 } =
    getWeb3Account();

  try {
    const nonce = await web3.eth.getTransactionCount(account);
    const encodedABI = contract.methods[contractMethodName]().encodeABI();

    const txObject: Transaction = {
      from: account,
      to: contractAddress,
      data: encodedABI,
      ...txObjectData,
    };

    const gas_estimate = await web3.eth.estimateGas(txObject);

    txObject.gas = gas_estimate;

    txObject.gasPrice = web3.utils.toWei("1", "gwei");

    const signedTx = await web3.eth.accounts.signTransaction(
      txObject,
      privateKey
    );

    const txReceipt = await web3.eth.sendSignedTransaction(
      signedTx.rawTransaction
    );

    return txReceipt;
  } catch (error) {
    throw error;
  }
};
