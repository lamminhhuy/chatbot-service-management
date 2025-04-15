
import winston from 'winston';
import { v4 as uuidv4 } from 'uuid';
import { NextFunction, Request, Response } from 'express';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.json()
  ),
  defaultMeta: { service: 'api-service' },
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
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
    message: 'Incoming request'
  });

  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info({
      requestId,
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration,
      message: 'Request completed'
    });

    if (res.statusCode >= 500) {
      logger.error({
        requestId,
        method: req.method,
        url: req.originalUrl,
        status: res.statusCode,
        duration,
        message: 'Server error'
      });
    }
  });

  (req as any).requestId = requestId;
  next();
};

export default loggerMiddleware;
