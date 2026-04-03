import { generateCookie, removeCookie } from "../utils/cookies.utils.js";
import { login, register } from "../services/user.service.js";
import {
  userLoginValidationSchema,
  userRegisterValidationSchema,
} from "../validations/user.validation.js";
import jwt from "jsonwebtoken";
import { zodErrorFormat } from "../utils/zodErrorFromatter.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/token.utlis.js";
import { env } from "../utils/env.utils.js";
import User from "../models/user.model.js";

export const registerUser = async (req, res) => {
  try {
    const result = userRegisterValidationSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "validation error",
        errors: zodErrorFormat(result.error),
      });
    }
    const user = await register(res, result.data);

    const accesstToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    user.refreshToken = refreshToken;
    await user.save();
    // console.log("user",user)
    generateCookie(res, "accessToken", accesstToken);
    generateCookie(res, "refreshToken", refreshToken);
    res.status(201).json({
      success: true,
      message: "Successfully User registered",
      user,
      accesstToken,
      refreshToken,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const result = userLoginValidationSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "validation error",
        errors: zodErrorFormat(result.error),
      });
    }

    const userExists = await login(res, result.data);

    const accesstToken = generateAccessToken(userExists._id);
    const refreshToken = generateRefreshToken(userExists._id);

    userExists.refreshToken = refreshToken;
    await userExists.save();
    // console.log("user",userExists)

    generateCookie(res, "accessToken", accesstToken);
    generateCookie(res, "refreshToken", refreshToken);

    res.status(200).json({
      success: true,
      message: "Successfully User login",
      user: userExists,
      accesstToken,
      refreshToken,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

export const logoutUser = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      const { id } = jwt.verify(refreshToken, env.JWT_SECRETKEY);
      const user = await User.findOne({ _id: id });
      user.refreshToken = null;
      await user.save();
    }

    // console.log("cookies clear called::")
    removeCookie(res, "accessToken");
    removeCookie(res, "refreshToken");

    res.status(200).json({
      success: true,
      message: "User logged out successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};
