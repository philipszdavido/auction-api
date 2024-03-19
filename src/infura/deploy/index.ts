import { Web3 } from "web3";
import fs from "fs";
import dotenv from "dotenv";
import { cwd } from "node:process";

const deploy = async () => {
  dotenv.config();

  console.log("Deploying contract to Infura", cwd());

  const byte = fs.readFileSync("./contract/AuctionABI.json");

  const { abi, bytecode } = JSON.parse(byte.toString());

  const network = process.env.ETHEREUM_NETWORK;
  const apiKey = process.env.INFURA_API_KEY;

  const web3 = new Web3(
    new Web3.providers.HttpProvider(`https://${network}.infura.io/v3/${apiKey}`)
  );

  const signer = web3.eth.accounts.privateKeyToAccount(
    "0x" + process.env.SIGNER_PRIVATE_KEY
  );
  web3.eth.accounts.wallet.add(signer);

  const contract = new web3.eth.Contract(abi);
  // @ts-ignore
  contract.options.data = bytecode;

  const deployTx = contract.deploy({
    data: "0x" + bytecode,
    arguments: [90000000000000, signer.address],
  });

  const estimatedGas = await deployTx.estimateGas();

  const deployedContract = await deployTx
    .send({
      from: signer.address,
      gas: estimatedGas.toString(),
    })

    .once("transactionHash", (txhash) => {
      console.log(`Mining deployment transaction ...`);
      console.log(`https://${network}.etherscan.io/tx/${txhash}`);
    });

  console.log(`Contract deployed at ${deployedContract.options.address}`);
  console.log(
    `Add contract address to the.env file to store the contract address: ${deployedContract.options.address}`
  );
};

deploy();
