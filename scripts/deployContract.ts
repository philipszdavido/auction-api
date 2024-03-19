import { Web3 } from "web3";
import artifacts from "../artifacts/contracts/SimpleAuction.sol/SimpleAuction.json";
import dotenv from "dotenv";

const deploy = async () => {
  const flag = process.argv[process.argv.length - 1];

  dotenv.config();

  console.log(`Deploying contract to ${flag.toLocaleUpperCase()}`);

  try {
    const { abi, bytecode } = artifacts;

    const network = process.env.ETHEREUM_NETWORK as string;
    const apiKey = process.env.SIGNER_PRIVATE_KEY;
    const auctionEndTime = process.env.AUCTION_END_TIME || 90000000000000;
    const beneficiaryAddress = process.env.BENEFICIARY_ADDRESS;

    const web3 = new Web3(new Web3.providers.HttpProvider(network));

    const signer = web3.eth.accounts.privateKeyToAccount(String(apiKey));
    web3.eth.accounts.wallet.add(signer);

    const contract = new web3.eth.Contract(abi);
    // @ts-ignore
    contract.options.data = bytecode;

    const deployTx = contract.deploy({
      data: bytecode,
      arguments: [auctionEndTime, beneficiaryAddress || signer.address],
    });

    const estimatedGas = await deployTx.estimateGas();

    const deployedContract = await deployTx
      .send({
        from: signer.address,
        gas: estimatedGas.toString(),
      })

      .once("transactionHash", (txhash) => {
        console.log(`Mining deployment transaction ...`);
        flag != "local" ||
          console.log(`https://${network}.etherscan.io/tx/${txhash}`);
      });

    console.log(`Contract deployed at ${deployedContract.options.address}`);
    console.log(
      `Add contract address to the.env file to store the contract address: ${deployedContract.options.address}`
    );
  } catch (error) {
    console.error(error);
  }
};

deploy();
