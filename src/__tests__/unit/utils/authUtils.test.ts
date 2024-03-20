import { signToken, verifyToken, decodeToken } from "../../../utils/auth";
import { JWT_SECRET } from "../../../utils/constants";

describe("Authentication Utility Functions", () => {
  const payload = { username: "testUser" };

  it("should generate a valid JWT token", () => {
    const token = signToken(payload);

    const decoded = verifyToken(token);

    expect(decoded).toMatchObject(payload);
  });

  it("should verify a valid JWT token", () => {
    const token = signToken(payload);

    const decoded = verifyToken(token);

    expect(decoded).toMatchObject(payload);
  });

  it("should decode a valid JWT token", () => {
    const token = signToken(payload);

    const decoded = decodeToken(token);

    expect(decoded).toMatchObject(payload);
  });
});
