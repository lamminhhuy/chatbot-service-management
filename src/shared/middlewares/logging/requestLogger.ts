import winston from 'winston';
import { v4 as uuidv4 } from 'uuid';
import { NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

interface ErrorsResponse extends Error {
  statusCode?: number;
}

const consoleFormat = winston.format.printf(({ level, message, timestamp, requestId, ...metadata }) => {
  const { method, url, status, duration, ip, userAgent, stack } = metadata;
  const formattedTimestamp = new Date(timestamp as string).toISOString();
  let logMessage = `${formattedTimestamp} [${level.toUpperCase()}] [${requestId}] ${message}`;

  if (method && url) {
    logMessage += ` | ${method} ${url}`;
  }
  if (status) {
    logMessage += ` | Status: ${status}`;
  }
  if (duration) {
    logMessage += ` | Duration: ${duration}ms`;
  }
  if (ip) {
    logMessage += ` | IP: ${ip}`;
  }
  if (userAgent) {
    logMessage += ` | UA: ${userAgent}`;
  }
  if (stack) {
    logMessage += `\nStack: ${stack}`;
  }

  return logMessage;
});

const devFilter = winston.format((info, opts) => {
  return process.env.NODE_ENV === 'dev' ? info : false;
});

const prodFilter = winston.format((info, opts) => {
  return process.env.NODE_ENV === 'production' ? info : false;
});

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'api-service', env: process.env.NODE_ENV || 'dev' },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        consoleFormat
      ),
    }),
    new winston.transports.File({
      filename: 'logs/dev_error.log',
      level: 'error',
      format: winston.format.combine(
        devFilter(),
        winston.format.timestamp(),
        winston.format.json()
      ),
    }),
    new winston.transports.File({
      filename: 'logs/dev_combined.log',
      format: winston.format.combine(
        devFilter(),
        winston.format.timestamp(),
        winston.format.json()
      ),
    }),
    new winston.transports.File({
      filename: 'logs/prod_error.log',
      level: 'error',
      format: winston.format.combine(
        prodFilter(),
        winston.format.timestamp(),
        winston.format.json()
      ),
    }),
    new winston.transports.File({
      filename: 'logs/prod_combined.log',
      format: winston.format.combine(
        prodFilter(),
        winston.format.timestamp(),
        winston.format.json()
      ),
    }),
  ],
});

const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const requestId = uuidv4();
  const start = Date.now();
  logger.info({
    requestId,
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    message: 'Incoming request',
  });

  res.on('finish', () => {
    const duration = Date.now() - start;
    const logDetails = {
      requestId,
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration,
      message: 'Request completed',
    };

    logger.info(logDetails);
  });

  (req as any).requestId = requestId;
  next();
};

const errorLoggerMiddleware = (err: ErrorsResponse, req: Request, res: Response, next: NextFunction) => {
  const requestId = (req as any).requestId || uuidv4();
  logger.error({
    requestId,
    method: req.method,
    url: req.originalUrl,
    message: 'Error occurred',
    error: err.message,
    stack: err.stack,
    statusCode: err.statusCode || 500,
  });

  (res as any).error = err;
  next(err);
};
const errorHandler = (
  err: ErrorsResponse,
  req: Request,
  res: Response,  
  next: NextFunction
): void => {
  const statusCode = err.statusCode || 500;

  const errorResponse = {
    success: false,
    statusCode,
    message: err.message || 'Internal Server Error',
    requestId: (req as any).requestId || null, 
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  };

  res.status(statusCode).json(errorResponse);
};

export { loggerMiddleware, errorLoggerMiddleware, errorHandler };