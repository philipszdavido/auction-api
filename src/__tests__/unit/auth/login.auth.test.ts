import { Request, Response } from "express";
import { login } from "../../../controllers/Auth";
import { find } from "../../../db/user.db";
import { comparePassword, signToken } from "../../../utils/auth";

jest.mock("../../../db/user.db", () => ({
  find: jest.fn(),
}));

jest.mock("../../../utils/auth", () => ({
  comparePassword: jest.fn(),
  signToken: jest.fn(),
}));

describe("Authentication Unit Test - Login", () => {
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

  it("should successfully login a user", async () => {
    const user = { username: "John", hashpassword: "hashedPassword" };

    (find as jest.Mock).mockReturnValue(user);

    (comparePassword as jest.Mock).mockResolvedValue(true);

    (signToken as jest.Mock).mockReturnValue("jwt_token");

    mockRequest.body = { username: "John", password: "password123" };

    await login(mockRequest as Request, mockResponse as Response);

    expect(find).toHaveBeenCalledWith("John");
    expect(comparePassword).toHaveBeenCalledWith(
      "password123",
      "hashedPassword"
    );
    expect(signToken).toHaveBeenCalledWith({
      username: "John",
      password: "password123",
    });
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({ token: "jwt_token" });
  });

  it("should return error if username is invalid", async () => {
    (find as jest.Mock).mockReturnValue(undefined);

    mockRequest.body = { username: "NonExistentUser", password: "password123" };

    await login(mockRequest as Request, mockResponse as Response);

    expect(find).toHaveBeenCalledWith("NonExistentUser");
    expect(comparePassword).not.toHaveBeenCalled();
    expect(signToken).not.toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: "Invalid username",
    });
  });

  it("should return error if password is wrong", async () => {
    const user = { username: "John", hashpassword: "hashedPassword" };

    (find as jest.Mock).mockReturnValue(user);

    (comparePassword as jest.Mock).mockResolvedValue(false);

    mockRequest.body = { username: "John", password: "wrongPassword" };

    await login(mockRequest as Request, mockResponse as Response);

    expect(find).toHaveBeenCalledWith("John");
    expect(comparePassword).toHaveBeenCalledWith(
      "wrongPassword",
      "hashedPassword"
    );
    expect(signToken).not.toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: "Wrong password",
    });
  });

  it("should return error if login fails due to an error", async () => {
    (find as jest.Mock).mockImplementation(() => {
      throw new Error("Database error");
    });

    mockRequest.body = { username: "John", password: "password123" };

    await login(mockRequest as Request, mockResponse as Response);

    expect(find).toHaveBeenCalledWith("John");
    expect(comparePassword).not.toHaveBeenCalled();
    expect(signToken).not.toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: "Login failed" });
  });

  it("should return error if username or password is missing", async () => {
    await login(mockRequest as Request, mockResponse as Response);

    expect(find).not.toHaveBeenCalled();
    expect(comparePassword).not.toHaveBeenCalled();
    expect(signToken).not.toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: "Login failed" });
  });
});
