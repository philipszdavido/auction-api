import request from "supertest";
import { server } from "../../..";
import { auctionStatus } from "../../../auctionContract/auctionStatus";
import { verify } from "jsonwebtoken";

jest.mock("../../../auctionContract/auctionStatus");
jest.mock("jsonwebtoken");

describe("Auction Routes - Status Endpoint", () => {
  afterAll(() => {
    server.close();
  });

  it("should return auction status", async () => {
    (auctionStatus as jest.Mock).mockReturnValueOnce({
      ended: false,
      beneficiary: "",
      pendingReturns: "3 ETH",
      highestBid: "3 ETH",
      auctionEndTime: new Date(),
      totalBids: 4,
    });

    (verify as jest.Mock).mockReturnValueOnce("");

    const res = await request(server)
      .get("/auction/status")
      .set("Authorization", "AuthToken");

    expect(res.statusCode).toEqual(200);

    expect(res.body).toHaveProperty("message", "Auction status");
    expect(res.body).toHaveProperty("data");

    expect(res.body.data).toHaveProperty("highestBid");
    expect(res.body.data).toHaveProperty("ended");
    expect(res.body.data).toHaveProperty("totalBids");
    expect(res.body.data).toHaveProperty("beneficiary");
    expect(res.body.data).toHaveProperty("auctionEndTime");
    expect(res.body.data).toHaveProperty("pendingReturns");
  });

  it("should return 401 if no token is provided", async () => {
    const res = await request(server).get("/auction/status");

    expect(res.statusCode).toEqual(401);

    expect(res.body).toHaveProperty("message", "Unauthorized");
  });
});
