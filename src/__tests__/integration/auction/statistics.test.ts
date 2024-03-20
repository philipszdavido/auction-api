import request from "supertest";
import { server } from "../../..";
import { verify } from "jsonwebtoken";
import { statisticsFn } from "../../../auctionContract/statistics";

jest.mock("../../../auctionContract/statistics");
jest.mock("jsonwebtoken");

describe("Auction Routes - Statistics Endpoint", () => {
  afterAll(() => {
    server.close();
  });

  it("should return auction statistics", async () => {
    (statisticsFn as jest.Mock).mockReturnValueOnce({
      totalBids: 3n,
      totalEthVolume: "4 ETH",
    });

    (verify as jest.Mock).mockReturnValueOnce("");

    const res = await request(server)
      .get("/auction/statistics")
      .set("Authorization", "AuthToken");

    expect(res.statusCode).toEqual(200);

    expect(res.body).toHaveProperty("message", "Statistics");
    expect(res.body).toHaveProperty("data");

    expect(res.body.data).toHaveProperty("totalBids");
    expect(res.body.data).toHaveProperty("totalEthVolume");
  });

  it("should return 401 if no token is provided", async () => {
    const res = await request(server).get("/auction/statistics");

    expect(res.statusCode).toEqual(401);

    expect(res.body).toHaveProperty("message", "Unauthorized");
  });
});
