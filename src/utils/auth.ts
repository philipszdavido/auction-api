import { JWT_SECRET } from "./constants";

import jsonwebtoken from "jsonwebtoken";

export function signToken(payload: object | any) {
  return jsonwebtoken.sign(payload, JWT_SECRET, {
    expiresIn: "1h",
  });
}

export function logout() {}
