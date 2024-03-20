import request from "supertest";
import { server as app } from "../../..";
import { comparePassword, signToken } from "../../../utils/auth";
import { User, find } from "../../../mock/user.db";

jest.mock("../../../mock/user.db");
jest.mock("../../../utils/auth");

afterAll((done) => {
  app.close(done);
});

describe("POST /auth/login", () => {
  it("should login successfully with correct username and password", async () => {
    const mockUser = {
      username: "testuser",
      hashedPassword: "hashedPassword123",
    };
    (find as jest.Mock).mockReturnValueOnce(mockUser);
    (comparePassword as jest.Mock).mockReturnValueOnce(true);
    (signToken as jest.Mock).mockReturnValueOnce("");

    const userData = {
      username: "testuser",
      password: "password123",
    };

    const response = await request(app)
      .post("/auth/login")
      .send(userData)
      .expect(200);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
  });

  it("should return 400 if username does not exist", async () => {
    (find as jest.Mock).mockReturnValueOnce(undefined);

    const userData = {
      username: "nonexistentuser",
      password: "password123",
    };

    const response = await request(app).post("/auth/login").send(userData);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Invalid username" });
  });

  it("should return 400 if password is incorrect", async () => {
    const mockUser = {
      username: "testuser",
      hashedPassword: "hashedPassword123",
    };
    (find as jest.Mock).mockReturnValueOnce(mockUser);
    (comparePassword as jest.Mock).mockReturnValueOnce(false);

    const userData = {
      username: "testuser",
      password: "wrongpassword",
    };

    const response = await request(app).post("/auth/login").send(userData);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Wrong password" });
  });

  it("should return 400 if username or password is missing", async () => {
    const userData: { password?: string; username?: string } = {
      password: "password123",
    };

    const response1 = await request(app).post("/auth/login").send(userData);

    expect(response1.status).toBe(400);
    expect(response1.body).toEqual({ message: "Invalid username" });

    userData.username = "testuser";
    delete userData.password;

    const response2 = await request(app).post("/auth/login").send(userData);

    expect(response2.status).toBe(400);
    expect(response2.body).toEqual({ message: "Invalid username" });
  });
});
