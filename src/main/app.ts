import express, { type Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { pino } from 'pino';
import { errorHandler } from '@/shared/middlewares/error/errorHandler';
import cookieParser from 'cookie-parser';
import { initializeDatabase } from '@/database/PostgresDB';
import RedisClient from '@/database/redisClient';
import 'reflect-metadata';
import { setUpContainers } from '@/container';
import { env } from '@/configs/envConfig';
import { ModuleLoader } from '@/shared/utils/ModuleLoader';
import { asyncHandler } from '@/shared/utils/asyncHandler';
import { initializePermission } from '@/shared/utils/initializePermission';
import { initializeTransactionalContext } from 'typeorm-transactional';
import { errorLoggerMiddleware } from '@/shared/middlewares/logging/requestLogger';
import { staticMiddleware } from '@/shared/middlewares/media/media.middleware';

const logger = pino({ name: 'server start' });
const app: Express = express();
const allowedOrigins = env.CORS_ORIGIN?.split(',') || [];

console.log('Allowed Origins:', allowedOrigins); // Debug

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: function (origin, callback) {
      console.log('Request Origin:', origin); // Debug
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`${origin} Not allowed by CORS`));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  })
);
app.use(helmet());

app.use('/uploads', staticMiddleware('uploads'));

async function initializeApp() {
  await initializeDatabase();
  await RedisClient.getInstance();
  setUpContainers();

  const modules = (await import('@/modules')).default;
  const middlewares = (await import('@/shared/middlewares')).default;

  app.use(...middlewares.appLevelMiddleware);

  const moduleLoader = ModuleLoader.getInstance(modules, middlewares.routerLevelMiddleware, asyncHandler);
  app.use(moduleLoader.loadAllModules());

  initializePermission(moduleLoader.getAllModules());

  app.use('/ping', (req, res) => {
    return res.status(200).send('server pinged!');
  });

  app.use(errorLoggerMiddleware);
  app.use(errorHandler);
}

initializeTransactionalContext();

initializeApp()
  .then(() => {
    logger.info('Application initialized successfully');
  })
  .catch((err) => {
    logger.error('Failed to initialize application:', err);
  });

export { app, logger };