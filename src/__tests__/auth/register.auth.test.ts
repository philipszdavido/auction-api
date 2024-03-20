import { Request, Response } from "express";
import { register } from "../../controllers/authController";
import { find, create } from "../../mock/user.db";

jest.mock("../../mock/user.db", () => ({
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

    expect(find).toHaveBeenCalledWith("John");
    expect(create).toHaveBeenCalledWith("John", expect.any(String));
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: "User created" });
  });

  it("should return error if username already exists", async () => {
    (find as jest.Mock).mockReturnValue(true);

    mockRequest.body = { username: "John", password: "password123" };

    await register(mockRequest as Request, mockResponse as Response);

    expect(find).toHaveBeenCalledWith("John");
    expect(create).not.toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: "Username is already taken",
    });
  });

  it("should return error if registration fails", async () => {
    (find as jest.Mock).mockReturnValue(false);

    (create as jest.Mock).mockImplementation(() => {
      throw new Error("Database error");
    });

    mockRequest.body = { username: "John", password: "password123" };

    await register(mockRequest as Request, mockResponse as Response);

    expect(find).toHaveBeenCalledWith("John");
    expect(create).toHaveBeenCalledWith("John", expect.any(String));
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: "Invalid username or password",
    });
  });

  it("should return error if username or password is missing", async () => {
    await register(mockRequest as Request, mockResponse as Response);

    expect(find).not.toHaveBeenCalled();
    expect(create).not.toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: "Invalid username or password",
    });
  });
});
