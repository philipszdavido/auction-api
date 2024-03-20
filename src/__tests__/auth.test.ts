import { Request, Response } from "express";
import { register } from "../controllers/authController";
import { find, create } from "../mock/user.db";

jest.mock("../mock/user.db", () => ({
  find: jest.fn(),
  create: jest.fn(),
}));

describe("Authentication Unit Test", () => {
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

  it("Register - User created", async () => {
    mockRequest.body = {
      username: "John",
      password: 909990,
    };
    await register(mockRequest as Request, mockResponse as Response);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
  });
});
