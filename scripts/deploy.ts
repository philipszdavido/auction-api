import { ethers } from "hardhat";
import dotenv from "dotenv";

async function main() {
  dotenv.config();

  const { BENEFICIARY_ADDRESS, AUCTION_END_TIME } = process.env;

  const beneficiaryAddress = String(BENEFICIARY_ADDRESS);
  const auctionEndTime = Number(AUCTION_END_TIME);

  const SimpleAuction = await ethers.getContractFactory("SimpleAuction");

  // Start deployment, returning a promise that resolves to a contract object
  const simpleAuction = await SimpleAuction.deploy(
    auctionEndTime,
    beneficiaryAddress
  );
  console.log(
    "Contract deployed to address:",
    await simpleAuction.getAddress()
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
