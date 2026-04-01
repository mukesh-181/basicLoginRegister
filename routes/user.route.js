import express from "express";
import {
  deleteUser,
  getAllUsers,
  getUserDetails,
  loginUser,
  regenrateAccessToken,
  registerUser,
  updateUser,
} from "../controllers/user.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/user-login", loginUser);
router.post("/user-register", registerUser);
router.get("/user-details", authMiddleware, getUserDetails);
// router.get("/user-logout", authMiddleware, logoutUser);
router.get("/user-all", authMiddleware, getAllUsers);
router.get("/user-delete/:id", authMiddleware, deleteUser);
router.put("/user-update/:id", authMiddleware, updateUser);
router.get('/user-refresh-token',regenrateAccessToken)

export default router;
