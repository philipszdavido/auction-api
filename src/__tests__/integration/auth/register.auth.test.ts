import request from "supertest";
import { create, find } from "../../../db/user.db";
import { server as app } from "../../..";
import {
  PASSWORD_MIN_LENGTH,
  USERNAME_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
} from "../../../utils/constants";
import { hashPassword } from "../../../utils/auth";

afterAll((done) => {
  app.close(done);
});

jest.mock("../../../db/user.db", () => ({
  find: jest.fn(),
  create: jest.fn(),
}));

jest.mock("../../../utils/auth", () => ({
  hashPassword: jest.fn(),
}));

describe("Integration Test: /register endpoint", () => {
  beforeEach(() => {});

  it("should register a new user", async () => {
    const userData = {
      username: "testUser",
      password: "testPassword",
    };
    (find as jest.Mock).mockReturnValue(false);
    (create as jest.Mock).mockReturnValue(true);
    (hashPassword as jest.Mock).mockReturnValue("testPassword");

    const response = await request(app)
      .post("/auth/register")
      .send(userData)
      .expect(200);

    expect(response.body.message).toBe("User created");

    const user = find(userData.username);
    expect(user).toBeDefined();
  });

  it("should return 400 if username is already taken", async () => {
    (find as jest.Mock).mockReturnValue(true);
    const existingUser = { username: "existingUser", password: "password" };
    create(existingUser.username, existingUser.password);

    const userData = {
      username: existingUser.username,
      password: "newPassword",
    };

    const response = await request(app)
      .post("/auth/register")
      .send(userData)
      .expect(400);

    expect(response.body.message).toBe("Username is already taken");
  });
});

describe("POST /auth/register", () => {
  it("should return 400 if username is missing", async () => {
    const userData = {
      password: "password123",
    };

    const response = await request(app).post("/auth/register").send(userData);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "message",
      "No username or password found"
    );
  });

  it("should return 400 if password is missing", async () => {
    const userData = {
      username: "testuser",
    };

    const response = await request(app).post("/auth/register").send(userData);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "message",
      "No username or password found"
    );
  });

  it("should return 400 if username is empty", async () => {
    const userData = {
      username: "",
      password: "password123",
    };

    const response = await request(app).post("/auth/register").send(userData);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "message",
      `Username is too short. The minimum length is ${USERNAME_MIN_LENGTH}`
    );
  });

  it("should return 400 if password is empty", async () => {
    const userData = {
      username: "testuser",
      password: "",
    };

    const response = await request(app).post("/auth/register").send(userData);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "message",
      `Password Too Short. Minimum lenght is ${PASSWORD_MIN_LENGTH}`
    );
  });

  it("should return 400 if username exceeds maximum length", async () => {
    const userData = {
      username: "a".repeat(256),
      password: "password123",
    };

    const response = await request(app).post("/auth/register").send(userData);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "message",
      `Username is too long. The maximum length is ${USERNAME_MAX_LENGTH}`
    );
  });

  it("should return 400 if password is too short", async () => {
    const userData = {
      username: "testuser",
      password: "123",
    };

    const response = await request(app).post("/auth/register").send(userData);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "message",
      `Password Too Short. Minimum lenght is ${PASSWORD_MIN_LENGTH}`
    );
  });
});
