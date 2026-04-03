import express from "express";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import cors from 'cors'

import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import { globalLimiter } from "./utils/rateLimiting.utils.js";


const app = express();
app.use(
  helmet({
    contentSecurityPolicy: false,
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173", // your frontend URL
    credentials: true,
  }))
app.use(globalLimiter);

app.get("/", (req, res) => {
  res.send("hello world");
});
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);

export default app;
