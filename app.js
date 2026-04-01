import express from "express";

import userRouter from "./routes/user.route.js";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import authRouter from "./routes/auth.route.js";

const app = express();
app.use(
  helmet({
    contentSecurityPolicy: false,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("hello world");
});
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);

export default app;
