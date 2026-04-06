import express from "express";

import {
  loginUser,
  logoutAllDevicesExceptCurrent,
  logoutSpecificDevice,
  logoutUser,
  registerUser,
} from "../controllers/auth.controller.js";
import { authLimiter } from "../utils/rateLimiting.utils.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/login", authLimiter, loginUser);
router.post("/register", authLimiter, registerUser);
router.post("/logout",authMiddleware, logoutUser);
router.post("/logout-all-except-current",authMiddleware, logoutAllDevicesExceptCurrent);
router.post("/logout-specific-device/:sessionId",authMiddleware, logoutSpecificDevice);




export default router;
