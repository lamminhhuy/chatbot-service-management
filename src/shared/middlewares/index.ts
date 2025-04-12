import { authenticateTokenMiddleware } from "@/modules/auth/utils/authenticateToken.middleware";
import { rateLimitMiddleware } from "./rate-limit/rateLimiter";
import requestLogger from "./logging/requestLogger";

const rateLimitConfig = {
   maxRequests: 10,
   windowMs: 60000,
   message: 'Too many requests, please try again later.'
}
const customOptions = {
   level: "info",
   redact: ["request.headers.authorization"], 
   enabled: true,
 };
 
export default {
   appLevelMiddleware: [requestLogger(customOptions),rateLimitMiddleware(rateLimitConfig)],
   routerLevelMiddleware: [authenticateTokenMiddleware]
}
