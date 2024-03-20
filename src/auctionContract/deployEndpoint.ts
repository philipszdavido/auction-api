import Web3 from "web3";
import artifacts from "../../artifacts/contracts/SimpleAuction.sol/SimpleAuction.json";
import dotenv from "dotenv";

export const deployEndpoint = async ({
  endTime,
  beneficiaryAddress,
}: {
  endTime: string;
  beneficiaryAddress: string;
}) => {
  try {
    dotenv.config();
    const url = process.env.ETHEREUM_NETWORK_API;

    const { bytecode, abi } = artifacts;

    const web3 = new Web3(url);

    const accounts = await web3.eth.getAccounts();

    const auctionContract = new web3.eth.Contract(abi);
    const deployTx = auctionContract.deploy({
      data: bytecode,
      arguments: [endTime, beneficiaryAddress],
    });

    const estimatedGas = await deployTx.estimateGas();

    const deployedContract = deployTx
      .send({
        from: accounts[0],
        gas: estimatedGas.toString(),
      })
      .once("transactionHash", (txhash) => {
        console.log(`Mining deployment transaction ...`);
        console.log(txhash);
      });

    return (await deployedContract).options.address;
  } catch (error) {
    throw error;
  }
};
