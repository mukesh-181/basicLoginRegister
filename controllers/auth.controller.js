import { removeCookie } from "../utils/cookies.utils.js";

export const logoutUser = async (req, res) => {
  try {
    // console.log("cookies clear called::")
    removeCookie(res,"accessToken")
    removeCookie(res,"refreshToken")


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
