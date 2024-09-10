import "dotenv/config";
import express from "express";
import { logger } from "./logger/logger.js";
import { connectDB } from "./db/mongo.db.js";
import { connectRedis } from "./services/redis.service.js";
import { userRouter } from "./routes/user.route.js";
import { taskRouter } from "./routes/task.route.js";
import { authMiddleware } from "./middleware/authorization.middleware.js";

(async () => {
     try {
          const app = express();
          app.use(express.json());
          await connectDB();
          await connectRedis();
          app.use("/", userRouter);
          app.use("/task", authMiddleware, taskRouter);
          const PORT = process.env.PORT || 3000;
          app.listen(PORT, () => logger.info(`server - Server running on port ${PORT}`));
     } catch (err) {
          logger.error(`server - Exception while running server - ${err.message}`);
          process.exit(1);
     }
})();
