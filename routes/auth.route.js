import express from "express";

import {
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/auth.controller.js";
import { authLimiter } from "../utils/rateLimiting.utils.js";

const router = express.Router();

router.post("/login", authLimiter, loginUser);
router.post("/register", authLimiter, registerUser);
router.post("/logout", logoutUser);

export default router;
