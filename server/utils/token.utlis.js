import jwt from "jsonwebtoken";
import { env } from "./env.utils.js";

export const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, env.JWT_SECRETKEY, {
    expiresIn: "15m",
  });
};

export const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, env.JWT_SECRETKEY, {
    expiresIn: "7d",
  });
};
