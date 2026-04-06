

import jwt from "jsonwebtoken";
import { env } from "../utils/env.utils.js";
import Session from "../models/session.model.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token not found",
      });
    }

    //  Verify JWT
    const decoded = jwt.verify(token, env.JWT_SECRETKEY);

    //  Check session in DB
    const session = await Session.findOne({
      accessToken: token,
      userId: decoded.id,
      isActive: true,
    });

    if (!session) {
      return res.status(401).json({
        success: false,
        message: "Session expired or logged out",
      });
    }

    //  Update lastActiveAt (with optimization)
    const now = new Date();
    const diff = now - session.lastActiveAt;

    if (diff > 5 * 60 * 1000) { // update only every 5 minutes
      session.lastActiveAt = now;
      await session.save();
    }

    //  Attach data to request
    req.user = decoded.id;
    req.sessionId = session._id;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};
