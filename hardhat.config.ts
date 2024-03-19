import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";

dotenv.config();

const { ETHEREUM_NETWORK, SIGNER_PRIVATE_KEY } = process.env;

const config: HardhatUserConfig = {
  solidity: "0.8.24",
};

export default config;
