import rateLimiter from "@/shared/middlewares/rateLimiter";
import cors from "cors";
import express, { type Express } from "express";
import helmet from "helmet";
import { pino } from "pino";
import { errorHandler } from "@/shared/middlewares/error/errorHanlder";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { mongoDBInstance } from "@/database/MongoDB";
import { initializeDatabase } from "@/database/PostgresDB";
import { pingServer } from "@/shared/utils/ping";
import * as cron from "node-cron";
import RedisClient from "@/database/redisClient";
import "reflect-metadata";
import { setUpContainers } from "@/container";
import asyncHandler from "@/shared/utils/asyncHandler";
import { env } from "@/configs/envConfig";

const logger = pino({ name: "server start" });
const app: Express = express();
const allowedOrigins = env.CORS_ORIGIN?.split(",") || [];
// Middleware setup
app.use(cookieParser());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }},
    credentials: true,
  })
);
app.use(helmet());
app.use(rateLimiter);

async function initializeApp() {
  await initializeDatabase(); 
  await mongoDBInstance.connect(); 
  await RedisClient.getInstance(); 
  setUpContainers(); 

  const chatRouter = (await import("@/modules/chatbot/routes/chatRoutes")).default;
  const promptRouter = (await import("@/modules/prompt/routes/promptRoutes")).default;
  const userRouter = (await import("@/modules/user/routes/UserRoute")).userRouter;
  const authRouter = (await import("@/modules/auth/routes/AuthRouter")).authRouter;
  const {authenticateTokenMiddleware} = (await import("@/modules/auth/utils/authenticateToken.middleware"));

  app.use("/ping", (req, res) => {
    return res.status(200).send("server pinged!");
  }); 
  
  app.use("/api/v1/auth", authRouter); 
  app.use("/api/v1/chat", chatRouter);
  app.use("/api/v1/prompt", promptRouter);

  app.use(asyncHandler(authenticateTokenMiddleware));

  app.use("/api/v1/user", userRouter);
  app.use((err, req, res, next) => {
    console.error("Lỗi xảy ra:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  });
  
app.use(errorHandler);
}

function getRandomPingTime() {
  const minutes = 3;
  return `*/${minutes} * * * *`;
}
const querySnapshot = cron.schedule(getRandomPingTime(), pingServer);

initializeApp()
  .then(() => {
    logger.info("Application initialized successfully");
  })
  .catch((err) => {
    logger.error("Failed to initialize application:", err);
  });


export { app, logger };