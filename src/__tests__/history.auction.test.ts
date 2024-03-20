import { Request, Response } from "express";
import { history } from "../controllers/auctionController";
import { bidHistory } from "../auctionContract/bidHistory";

jest.mock("../auctionContract/bidHistory");

describe("Auction Controller - History", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
  });

  it("should return bid history", async () => {
    (bidHistory as jest.Mock).mockResolvedValue(["bid1", "bid2"]);

    await history(mockRequest as Request, mockResponse as Response);

    expect(bidHistory).toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: "Bid history",
      data: ["bid1", "bid2"],
    });
  });

  it("should handle error if getting bid history fails", async () => {
    (bidHistory as jest.Mock).mockRejectedValue(new Error("Database error"));

    await history(mockRequest as Request, mockResponse as Response);

    expect(bidHistory).toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(500);
  });
});
