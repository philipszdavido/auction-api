import request from "supertest";
import { server } from "../../..";
import { verify } from "jsonwebtoken";
import { bidHistory } from "../../../auctionContract/bidHistory";

jest.mock("../../../auctionContract/bidHistory");
jest.mock("jsonwebtoken");

describe("Auction Routes - History Endpoint", () => {
  afterAll(() => {
    server.close();
  });

  it("should return bid history", async () => {
    (bidHistory as jest.Mock).mockReturnValueOnce([
      {
        bidder: "",
        amount: "3 ETH",
      },
    ]);

    (verify as jest.Mock).mockReturnValueOnce("");

    const res = await request(server)
      .get("/auction/history")
      .set("Authorization", "AuthToken");

    expect(res.statusCode).toEqual(200);

    expect(res.body).toHaveProperty("message", "Bid history");
    expect(res.body).toHaveProperty("data");

    expect(Array.isArray(res.body.data)).toBe(true);
    if (res.body.data.length > 0) {
      expect(res.body.data[0]).toHaveProperty("bidder");
      expect(res.body.data[0]).toHaveProperty("amount");
    }
  });

  it("should return 401 if no token is provided", async () => {
    const res = await request(server).get("/auction/history");

    expect(res.statusCode).toEqual(401);

    expect(res.body).toHaveProperty("message", "Unauthorized");
  });
});
