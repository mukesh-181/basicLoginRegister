import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import mongoose from "mongoose";
import { generateAccessToken } from "../utils/token.utlis.js";

import { env } from "../utils/env.utils.js";
import { generateCookie } from "../utils/cookies.utils.js";

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

export const regenrateAccessToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh Token not found",
      });
    }

    const { id } = jwt.verify(refreshToken, env.JWT_SECRETKEY);
    const user = await User.findOne({ _id: id });
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({
        success: false,
        message: "Refresh Token Invalid",
      });
    }

    const accessToken = generateAccessToken(id);
    generateCookie(res, "accessToken", accessToken);

    res.status(200).json({
      success: true,
      message: "Successfully Access Token Generated ",
      accessToken,
      refreshToken,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};
