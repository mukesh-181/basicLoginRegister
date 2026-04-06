import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    accessToken: String,
    refreshToken: String,
    device: String,
    ip: String,
    isActive: {
      type: Boolean,
      default: true,
    },
    lastActiveAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);


const Session= mongoose.model("Session", sessionSchema);
export default Session;
