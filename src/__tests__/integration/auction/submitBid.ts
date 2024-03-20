import request from "supertest";
import { server } from "../../..";
import { verify } from "jsonwebtoken";
import { submitBid as submitBidAuction } from "../../../auctionContract/submitBid";

jest.mock("../../../auctionContract/submitBid");
jest.mock("jsonwebtoken");

describe("Auction Routes - Status Endpoint", () => {
  afterAll(() => {
    server.close();
  });

  it("should submit a bid", async () => {
    (submitBidAuction as jest.Mock).mockReturnValueOnce({
      blockHash: "",
    });

    (verify as jest.Mock).mockReturnValueOnce("");

    const res = await request(server)
      .post("/auction/submit-bid")
      .send({ bid: 90 })
      .set("Authorization", "AuthToken");

    expect(res.statusCode).toEqual(200);

    expect(res.body).toHaveProperty("message", "Bid submitted successfully");
    expect(res.body).toHaveProperty("data");

    expect(res.body.data).toHaveProperty("blockHash");
  });

  it("should throw error when a bid is missing", async () => {
    (submitBidAuction as jest.Mock).mockReturnValueOnce({
      blockHash: "",
    });

    (verify as jest.Mock).mockReturnValueOnce("");

    const res = await request(server)
      .post("/auction/submit-bid")
      .send()
      .set("Authorization", "AuthToken");

    expect(res.statusCode).toEqual(400);

    expect(res.body).toHaveProperty("message", "There is no bid amount");
    expect(res.body).not.toHaveProperty("data");
  });

  it("should return 401 if no token is provided", async () => {
    const res = await request(server).post("/auction/submit-bid");

    expect(res.statusCode).toEqual(401);

    expect(res.body).toHaveProperty("message", "Unauthorized");
  });
});
