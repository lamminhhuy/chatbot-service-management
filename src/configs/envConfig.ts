import dotenv from "dotenv";
import { cleanEnv, host, num, port, str } from "envalid";

dotenv.config();

export const env = cleanEnv(process.env, {
  NODE_ENV: str({
    default: "dev",
    choices: ["dev", "pro", "test"],
  }),
  POSTGRES_USER: str({
    default: 'postgres'
  }),
  POSTGRES_PASSWORD: str({
  default: 'postgres'
  }),
  POSTGRES_DB: str({
      default: 'chatbotdb'
  }),
  POSTGRES_HOST: str({
    default: 'localhost'
}),
  POSTGRES_PORT: num({
  default: 5432
  }),
  POSTGRES_MAX_POOL_SIZE: num({
    default:20
  }), 
  MONGO_URI: str({
    default: "mongodb://chatbot-mongo:27017/chatbotdb"
  }),
  REDIS_URL: str({
    default: "redis://localhost:6379", 
  }),
  GOOGLE_GEMINI_API_KEY: str(),
  HOST: host({
    default: "localhost"
  }),
  PORT: port({
    default: 5001,
  }),
  CORS_ORIGIN: str({
    default: "http://localhost:3000", 
  }),
  COMMON_RATE_LIMIT_MAX_REQUESTS: num({
    default: 1000, 
  }),
  COMMON_RATE_LIMIT_WINDOW_MS: num({
    default: 1000,
  }),
});
