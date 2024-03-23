import { Request, Response } from "express";
import { statistics } from "../../../controllers/Auction";
import { statisticsFn } from "../../../auctionContract/statistics";

jest.mock("../../../auctionContract/statistics");

describe("Auction Controller - Statistics", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return auction statistics", async () => {
    (statisticsFn as jest.Mock).mockResolvedValue({
      totalBids: 10,
      highestBid: 500,
    });

    await statistics(mockRequest as Request, mockResponse as Response);

    expect(statisticsFn).toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: "Statistics",
      data: { totalBids: 10, highestBid: 500 },
    });
  });

  it("should handle error if getting statistics fails", async () => {
    (statisticsFn as jest.Mock).mockRejectedValue(
      new Error("Statistics error")
    );

    await statistics(mockRequest as Request, mockResponse as Response);

    expect(statisticsFn).toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(500);
  });
});
