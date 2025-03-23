import rateLimiter from "@/shared/middlewares/rateLimiter";
import cors from "cors";
import express, { type Express } from "express";
import helmet from "helmet";
import { pino } from "pino";
import { errorHandler } from "@/shared/middlewares/error/errorHanlder";
import cookieParser from "cookie-parser";
import  morgan  from 'morgan';
import { env } from "@/configs/envConfig";
import chatRouter from "@/modules/chatbot/routes/chatRoutes";
import { mongoDBInstance } from "@/database/MongoDB";
import { initializeDatabase } from "@/database/PostgresDB";
import { pingServer } from "@/shared/utils/ping";
import * as cron from 'node-cron';
import { redisInstance } from "@/database/redisClient";
import promptRouter from "@/modules/prompt/routes/promptRoutes";
import { userRouter } from "@/modules/user/routes/UserRoute";
import { authRouter } from "@/modules/auth/routes/AuthRouter";

const logger = pino({ name: "server start" });
const app: Express = express();

app.use(cookieParser());
app.set("trust proxy", true);
app.use(morgan('dev')); 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    cors({
      origin: env.CORS_ORIGIN,
      credentials: true, 
    })
  );
app.use(helmet());
app.use(rateLimiter);

initializeDatabase()
mongoDBInstance;
redisInstance;

app.use(`/api/v1/chat`, chatRouter);
app.use(`/api/v1/prompt`, promptRouter);
app.use(`/api/v1/user`, userRouter);
app.use(`/api/v1/auth`, authRouter);

app.use(errorHandler);

function getRandomPingTime() {
  const minutes = 3;
  const cronTime = `*/${minutes} * * * *`;

  return cronTime;
}
const querySnapshot = cron.schedule(getRandomPingTime(), pingServer);
export { app, logger };
