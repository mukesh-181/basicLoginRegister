import app from "./app.js";

import { connectDB } from "./config/db.config.js";

import { env } from "./utils/env.utils.js";

const PORT = env.PORT;
const runServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`server iss running on ${PORT}`);
    });
  } catch (error) {
    process.exit(1);
  }
};

runServer();
