import { Request, Response } from "express";
import { status } from "../../../controllers/auctionController";
import { auctionStatus } from "../../../auctionContract/auctionStatus";

jest.mock("../../../auctionContract/auctionStatus");

describe("Auction Controller - Status", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
  });

  it("should return auction status", async () => {
    (auctionStatus as jest.Mock).mockResolvedValue(123);

    await status(mockRequest as Request, mockResponse as Response);

    expect(auctionStatus).toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: "Auction status",
      data: 123,
    });
  });

  it("should handle error if getting auction status fails", async () => {
    (auctionStatus as jest.Mock).mockRejectedValue(new Error("Database error"));

    await status(mockRequest as Request, mockResponse as Response);

    expect(auctionStatus).toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(500);
  });
});
