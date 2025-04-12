import { Request, Response, NextFunction } from 'express';
interface RateLimitConfig {
  maxRequests: number; 
  windowMs: number;
  message?: string;
}

interface RateLimitStore {
  [ip: string]: {
    requests: number;
    resetTime: number;
  };
}

const rateLimitStore: RateLimitStore = {};

export function rateLimitMiddleware(config: RateLimitConfig) {
  const { maxRequests, windowMs, message = 'Too many requests, please try again later.' } = config;

  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip; 
    const currentTime = Date.now();

    if (!rateLimitStore[ip as string]) {
      rateLimitStore[ip as string] = {
        requests: 0,
        resetTime: currentTime + windowMs,
      };
    }

    const store = rateLimitStore[ip as string];

    if (currentTime > store.resetTime) {
      store.requests = 0;
      store.resetTime = currentTime + windowMs;
    }

    store.requests += 1;

    res.setHeader('X-RateLimit-Limit', maxRequests);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, maxRequests - store.requests));
    res.setHeader('X-RateLimit-Reset', Math.floor(store.resetTime / 1000)); 

    if (store.requests > maxRequests) {
      return res.status(429).json({
        error: 'Rate limit exceeded',
        message,
        retryAfter: Math.ceil((store.resetTime - currentTime) / 1000),
      });
    }

    next();
  };
}

