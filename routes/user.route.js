import express from "express";
import {
  deleteUser,
  getAllUsers,
  getUserDetails,
  regenrateAccessToken,
  updateUser,
} from "../controllers/user.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/details", authMiddleware, getUserDetails);

router.get("/all-users", authMiddleware, getAllUsers);
router.get("/delete/:id", authMiddleware, deleteUser);
router.put("/update/:id", authMiddleware, updateUser);
router.get("/refresh-token", regenrateAccessToken);

export default router;
