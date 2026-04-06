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
import Session from "../models/session.model.js";

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

    const device = req.headers["user-agent"];
const ip = req.ip;


let isSessionExists = await Session.findOne({
  userId:userExists._id,
  device,
  ip,
  isActive: true,
});

if (isSessionExists) {
 
  return res.status(200).json({
    success: true,
    message: "Already logged in",
    sessionId: isSessionExists._id,
  });
}

    const accesstToken = generateAccessToken(userExists._id);
    const refreshToken = generateRefreshToken(userExists._id);

    const session = await Session.create({
      userId: userExists._id,
      accessToken: accesstToken,
      refreshToken,
      device: req.headers["user-agent"],
      ip: req.ip,
      isActive: true,
    });

    // console.log("user",userExists)

    generateCookie(res, "accessToken", accesstToken);
    generateCookie(res, "refreshToken", refreshToken);

    res.status(200).json({
      success: true,
      message: "Successfully User login",
      user: userExists,
      session,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

export const logoutUser = async (req, res) => {
  try {
    const sessionId = req.sessionId;
    const userId = req.user;

    const session = await Session.findOne({
      _id: sessionId,
      userId: userId,
      isActive: true,
    });
    if (session) {
      session.isActive = false;
      await session.save();
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



export const logoutAllDevicesExceptCurrent = async (req, res) => {
  try {
    const sessionId = req.sessionId;
    const userId = req.user;

    const session = await Session.updateMany({
      _id: {$ne:sessionId},
      userId: userId,
      isActive: true,
    },{isActive:false});
    

    res.status(200).json({
      success: true,
      message: "All other devices logged out successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

export const logoutSpecificDevice = async (req, res) => {
  try {
    const sessionId = req.params.sessionId;
    const userId = req.user;

    const session = await Session.findOneAndUpdate({
      _id: sessionId,
      userId: userId,
      isActive: true,
    },{isActive:false});
    // console.log("session",session)
    

    res.status(200).json({
      success: true,
      message: `Device ${session.device} is logged out successfully`,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

