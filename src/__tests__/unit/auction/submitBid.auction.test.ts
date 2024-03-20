import { Request, Response } from "express";
import { submitBid } from "../../../controllers/auctionController";
import { submitBid as submitBidAuction } from "../../../auctionContract/submitBid";

jest.mock("../../../auctionContract/submitBid");

describe("Auction Controller - Submit Bid", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockRequest = { body: { bid: 100 } };
    mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should submit a bid successfully", async () => {
    (submitBidAuction as jest.Mock).mockResolvedValue("txnReceipt123");

    await submitBid(mockRequest as Request, mockResponse as Response);

    expect(submitBidAuction).toHaveBeenCalledWith(100);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: "Bid submitted successfully",
      data: "txnReceipt123",
    });
  });

  it("should handle error if bid submission fails", async () => {
    (submitBidAuction as jest.Mock).mockRejectedValue(
      new Error("Submission error")
    );

    await submitBid(mockRequest as Request, mockResponse as Response);

    expect(submitBidAuction).toHaveBeenCalledWith(100);
    expect(mockResponse.status).toHaveBeenCalledWith(500);
  });
});
