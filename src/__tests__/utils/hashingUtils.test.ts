import { hashPassword, comparePassword } from "../../utils/auth";

describe("Password Hashing Utility Functions", () => {
  const password = "testPassword";

  it("should hash a password", async () => {
    const hashedPassword = await hashPassword(password);

    expect(hashedPassword).toBeDefined();
    expect(hashedPassword).not.toEqual(password);
  });

  it("should compare a password with its hash", async () => {
    const hashedPassword = await hashPassword(password);

    const result = await comparePassword(password, hashedPassword);

    expect(result).toBe(true);
  });

  it("should return false for mismatched passwords", async () => {
    const hashedPassword = await hashPassword(password);

    const result = await comparePassword("wrongPassword", hashedPassword);

    expect(result).toBe(false);
  });
});
