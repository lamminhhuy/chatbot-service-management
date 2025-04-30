import { authenticateTokenMiddleware } from "@/modules/auth/middlewares/authenticateToken.middleware";
import { rateLimitMiddleware } from "./rate-limit/rateLimiter";
import requestLogger from "./logging/requestLogger";
import { authorizationMiddleware } from "./authorization/authorization.middleware";
import { env } from "../../configs/envConfig";

const rateLimitConfig = {
   maxRequests: env.COMMON_RATE_LIMIT_MAX_REQUESTS,
   windowMs: 60000,
   message: 'Too many requests, please try again later.'
}

export default {
   appLevelMiddleware: [requestLogger,rateLimitMiddleware(rateLimitConfig)],
   routerLevelMiddleware: [authenticateTokenMiddleware,authorizationMiddleware]
}
