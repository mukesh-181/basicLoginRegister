import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";


import User from "../models/user.model.js";
import { generateAccessToken } from "../utils/token.utlis.js";

import { env } from "../utils/env.utils.js";
import { generateCookie } from "../utils/cookies.utils.js";
import Session from "../models/session.model.js";

export const getUserDetails = async (req, res) => {
  try {
    const id = req.user;

    const user = await User.findOne({ _id: id }).select("-password");
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not exists" });
    }

    res.status(200).json({
      success: true,
      message: "User detail fetched successfully",
      user,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");

    if (!users.length > 0) {
      return res
        .status(400)
        .json({ success: false, message: "No users exists" });
    }

    res.status(200).json({
      success: true,
      message: "All Users details fetched successfully",
      totalusersFound: users.length,
      users,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Invalid Id" });
    }
    const userDeleted = await User.findByIdAndDelete(id);
    if (!userDeleted) {
      return res
        .status(400)
        .json({ success: false, message: "Failed to Delete User" });
    }
    res.status(200).json({
      success: true,
      message: "User Deleted successfully",
      userId: id,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const updatedData = req.body;
    const id = req.params.id;

    if (!Object.keys(updatedData).length) {
      return res.status(400).json({
        success: false,
        message: "Update data is required",
      });
    }

    if (updatedData.password) {
      const hashPassword = await bcrypt.hash(updatedData.password, 10);
      updatedData.password = hashPassword;
    }

    const updatedUser = await User.findByIdAndUpdate(id, updatedData, {
      returnDocument: "after",
    });

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User Data Updated Successfully",
      updatedUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};



export const regenerateAccessToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh token not found",
      });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, env.JWT_SECRETKEY);

    //  Find session (NOT user)
    const session = await Session.findOne({
      refreshToken,
      userId: decoded.id,
      isActive: true,
    });

    if (!session) {
      return res.status(403).json({
        success: false,
        message: "Invalid or expired session",
      });
    }

    //  Generate new access token
    const newAccessToken = generateAccessToken(decoded.id);

    //  Update session
    session.accessToken = newAccessToken;


    await session.save();

    //  Set cookie
    generateCookie(res, "accessToken", newAccessToken);

    res.status(200).json({
      success: true,
      message: "Access token regenerated successfully",
      accessToken: newAccessToken,
    });
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: "Invalid or expired refresh token",
    });
  }
};


export const getMyDevices = async (req, res) => {
  try {
    const allDevices = await Session.find({userId:req.user,isActive:true})

    if (allDevices.length === 0) {
      return res
        .status(200)
        .json({ success: false, message: "No Devices Found" });
    }

    res.status(200).json({
      success: true,
      message: "All Devices fetched successfully",
      totalActiveDevices: allDevices.length,
      allDevices,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};