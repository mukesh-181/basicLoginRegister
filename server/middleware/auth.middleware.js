import jwt from "jsonwebtoken";
import { env } from "../utils/env.utils.js";

export const authMiddleware = (req, res, next) => {
  try {
    const token = req.cookies.accessToken;
    // console.log("middleware:::", req.cookies);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token not found",
      });
    }

    const decoded = jwt.verify(token, env.JWT_SECRETKEY);
    // console.log("decoded", decoded);

    req.user = decoded.id;

    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};
