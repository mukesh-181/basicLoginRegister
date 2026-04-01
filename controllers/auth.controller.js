import { generateCookie, removeCookie } from "../utils/cookies.utils.js";
import { login, register } from "../services/user.service.js";
import {
  userLoginValidationSchema,
  userRegisterValidationSchema,
} from "../validations/user.validation.js";

import { zodErrorFormat } from "../utils/zodErrorFromatter.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/token.utlis.js";

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
