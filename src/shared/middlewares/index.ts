import { authenticateTokenMiddleware } from "@/modules/auth/middlewares/authenticateToken.middleware";
import { rateLimitMiddleware } from "./rate-limit/rateLimiter";
import requestLogger from "./logging/requestLogger";

const rateLimitConfig = {
   maxRequests: 10,
   windowMs: 60000,
   message: 'Too many requests, please try again later.'
}

export default {
   appLevelMiddleware: [requestLogger,rateLimitMiddleware(rateLimitConfig)],
   routerLevelMiddleware: [authenticateTokenMiddleware]
}
