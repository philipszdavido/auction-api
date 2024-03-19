import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";

dotenv.config();

const { ETHEREUM_NETWORK, SIGNER_PRIVATE_KEY } = process.env;

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  defaultNetwork: "localhost",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
      accounts: [String(SIGNER_PRIVATE_KEY)],
    },
    alchemy: {
      url: String(ETHEREUM_NETWORK),
      accounts: [String(SIGNER_PRIVATE_KEY)],
    },
  },
};

export default config;
