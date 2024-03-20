import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import hre from "hardhat";

const account1 = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
const account19 = "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199";
const account18 = "0xdD2FD4581271e230360230F9337D5c0430Bf44C0";

describe("SimpleAuction", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployAuctionFixture() {
    const beneficiaryAddress = account18;
    const auctionEndTime = Number(900000);

    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount, otherAccount2] = await hre.ethers.getSigners();

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
      otherAccount2,
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
        from: account1,
      });

      expect(await simpleAuction.highestBidder()).to.equal(account1);

      expect(await simpleAuction.highestBid()).to.equal(100);
    });
  });

  describe("Bidding With Auction and Amount Cases", function () {
    it("Should not accept a bid after the auction has ended", async function () {
      const { simpleAuction } = await loadFixture(deployAuctionFixture);

      // Advance time to the end of the auction
      await time.increase(900001); // 900001 seconds = 1 second after auction end

      const bidAmount = 100;
      // Attempt to make a bid after the auction has ended
      await expect(
        simpleAuction.bid({
          value: bidAmount,
          from: account1,
        })
      ).to.be.revertedWith("Auction already ended");
    });

    it("Should not accept a bid lower than the current highest bid", async function () {
      const { simpleAuction } = await loadFixture(deployAuctionFixture);

      await simpleAuction.bid({
        value: 100,
        from: account1,
      });

      const bidAmount = 50;
      // Make a bid that is lower than the initial highest bid
      await expect(
        simpleAuction.bid({
          value: bidAmount,
          from: account1,
        })
      ).to.be.revertedWith("There already is a higher bid");
    });

    it("Should refund the previous highest bidder if outbid", async function () {
      const { simpleAuction } = await loadFixture(deployAuctionFixture);

      const initialBidAmount = 100;
      const newBidAmount = 150;

      // Make an initial bid
      await simpleAuction.bid({
        value: initialBidAmount,
        from: account1,
      });

      // Make a new bid that outbids the initial bid
      await simpleAuction.bid({
        value: newBidAmount,
        from: account1,
      });

      // Check that the previous highest bidder has been refunded
      expect(await simpleAuction.pendingReturns(account1)).to.equal(
        initialBidAmount
      );
    });
  });

  describe("Withdraw", function () {
    it("Should allow participants to withdraw their pending returns", async function () {
      const { simpleAuction } = await loadFixture(deployAuctionFixture);

      const initialBidAmount = 100;

      // Make a bid
      await simpleAuction.bid({
        value: initialBidAmount,
        from: account1,
      });

      // Attempt to withdraw pending returns
      await simpleAuction.withdraw();

      // Check that the pending returns have been withdrawn
      expect(await simpleAuction.pendingReturns(account1)).to.equal(0);
    });

    it("Should not withdraw if a participant attempts to withdraw without pending returns", async function () {
      const { simpleAuction, otherAccount2 } = await loadFixture(
        deployAuctionFixture
      );

      expect(await simpleAuction.pendingReturns(account1)).to.equal(0);

      // Attempt to withdraw pending returns without making a bid
      await simpleAuction.withdraw();

      expect(await simpleAuction.pendingReturns(account1)).to.equal(0);

      // Create new Auction Runner
      const newSimpleAuction = simpleAuction.connect(otherAccount2);

      // Make a bid
      await newSimpleAuction.bid({
        value: 90,
        from: account19,
      });

      // Make a higher bid
      await newSimpleAuction.bid({
        value: 190,
        from: account19,
      });

      // Pending Returns should be 90
      expect(await newSimpleAuction.pendingReturns(account19)).to.equal(90);

      // Withdraw
      await newSimpleAuction.withdraw();

      // Pending Returns should be 0
      expect(await newSimpleAuction.pendingReturns(account19)).to.equal(0);
    });
  });

  describe("AuctionEnd", function () {
    it("Should end the auction and transfer funds to the beneficiary", async function () {
      const { simpleAuction } = await loadFixture(deployAuctionFixture);

      const initialBidAmount = 100;

      // Make a bid
      await simpleAuction.bid({
        value: initialBidAmount,
        from: account1,
      });

      // Advance time to the end of the auction
      await time.increase(900001); // 900001 seconds = 1 second after auction end

      await simpleAuction.auctionEnd();

      // Check that the auction has ended
      expect(await simpleAuction.ended()).to.equal(true);

      // Check that the beneficiary has received the funds
      expect(
        await hre.ethers.provider.getBalance(simpleAuction.beneficiary())
      ).to.be.gt(0);
    });
  });
});
