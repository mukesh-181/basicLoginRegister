import User from "../models/user.model.js";
import bcrypt from "bcrypt";

export const login = async (res, data) => {
  const { email, password } = data;

  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }
  const userExists = await User.findOne({ email });
  if (!userExists) {
    return res.status(400).json({ success: false, message: "User not exists" });
  }
  const isPasswordCorrect = await bcrypt.compare(password, userExists.password);
  if (!isPasswordCorrect) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid Credentials" });
  }
  return userExists;
};

export const register = async (res, data) => {
  const { userName, email, password } = data;
  if (!userName || !email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res
      .status(400)
      .json({ success: false, message: "User already exists" });
  }
  const hashPassword = await bcrypt.hash(password, 10);

  const user = await User.create({ userName, email, password: hashPassword });
  return user;
};
