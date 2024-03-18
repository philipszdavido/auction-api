import Web3 from "web3";
import artifacts from "../../artifacts/contracts/SimpleAuction.sol/SimpleAuction.json";
import dotenv from "dotenv";

export const getNetworkUrl = () => {
  dotenv.config();

  const network = process.env.ETHEREUM_NETWORK;
  const apiKey = process.env.INFURA_API_KEY;
  const useLocal = process.env.USE_LOCAL_NODE;

  let url = `https://${network}.infura.io/v3/${apiKey}`;

  if (useLocal === "true") {
    url = `http://localhost:8545`;
  }
  return url;
};

export const getWeb3Account = () => {
  const network = process.env.ETHEREUM_NETWORK;
  const apiKey = process.env.INFURA_API_KEY;
  const contractAddress = process.env.CONTRACT_ADDRESS;
  const signerKey = process.env.SIGNER_PRIVATE_KEY;

  const url = getNetworkUrl();

  const web3 = new Web3(url);

  const contractABI = artifacts.abi;

  const contract = new web3.eth.Contract(contractABI, contractAddress);

  const signer = web3.eth.accounts.privateKeyToAccount(String(signerKey));
  web3.eth.accounts.wallet.add(signer);

  const privateKey = signer.privateKey;

  const account = signer.address;

  return {
    contract,
    account,
    privateKey,
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

    const txObject = {
      from: account,
      to: contractAddress,
      data: encodedABI,
      ...txObjectData,
    };

    const gas_estimate = await web3.eth.estimateGas(txObject);

    // @ts-ignore
    txObject.gas = gas_estimate;

    // @ts-ignore
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
