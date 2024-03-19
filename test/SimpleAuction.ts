import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import hre from "hardhat";

describe("SimpleAuction", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployAuctionFixture() {
    const beneficiaryAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    const auctionEndTime = Number(900000);

    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await hre.ethers.getSigners();

    const SimpleAuction = await hre.ethers.getContractFactory("SimpleAuction");
    const simpleAuction = await SimpleAuction.deploy(
      auctionEndTime,
      beneficiaryAddress
    );

    return {
      simpleAuction,
      auctionEndTime,
      beneficiaryAddress,
      owner,
      otherAccount,
    };
  }

  describe("Deployment", function () {
    it("Should set the right auctionEndTime", async function () {
      const { simpleAuction, auctionEndTime } = await loadFixture(
        deployAuctionFixture
      );

      const currentTimestamp = await time.latest();

      const expectedEndTime = currentTimestamp + auctionEndTime;

      expect(await simpleAuction.auctionEndTime()).to.equal(expectedEndTime);
    });

    it("Should set the right beneficiary", async function () {
      const { simpleAuction, beneficiaryAddress } = await loadFixture(
        deployAuctionFixture
      );
      expect(await simpleAuction.beneficiary()).to.equal(beneficiaryAddress);
    });

    it("Should set the highest bid", async function () {
      const { simpleAuction } = await loadFixture(deployAuctionFixture);
      expect(await simpleAuction.highestBid()).to.equal(0);
    });

    it("Should set the highest bidder", async function () {
      const { simpleAuction } = await loadFixture(deployAuctionFixture);
      expect(await simpleAuction.highestBidder()).to.equal(
        "0x0000000000000000000000000000000000000000"
      );
    });
  });
  describe("Bidding", function () {
    it("Should make a bid", async function () {
      const { simpleAuction } = await loadFixture(deployAuctionFixture);

      expect(await simpleAuction.auctionEndTime()).to.be.gt(
        await time.latest()
      );

      const bidAmount = 100; // wei
      await simpleAuction.bid({
        value: bidAmount,
        from: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
      });

      expect(await simpleAuction.highestBidder()).to.equal(
        "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
      );

      expect(await simpleAuction.highestBid()).to.equal(100);
    });
  });
});
