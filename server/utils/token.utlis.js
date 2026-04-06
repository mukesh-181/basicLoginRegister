import jwt from "jsonwebtoken";
import { env } from "./env.utils.js";

export const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, env.JWT_SECRETKEY, {
    expiresIn: "10s",
  });
};

export const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, env.JWT_SECRETKEY, {
    expiresIn: "7d",
  });
};
