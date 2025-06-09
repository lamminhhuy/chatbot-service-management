import dotenv from "dotenv";
import { cleanEnv, host, num, port, str } from "envalid";

dotenv.config();

const isPro = process.env.NODE_ENV === 'pro';

export const env = cleanEnv(process.env, {
  BASE_URL:  str(),
  JWT_REFRESH_SECRET: str({ default: 'mysecretToken123' }),
  JWT_ACCESS_SECRET: str({ default: 'mysecretToken123' }),
  NODE_ENV: str({
    default: "dev",
    choices: ["dev", "pro", "test"],
  }),
  COOKIE_MAX_AGE: num({ default: 30 * 24 * 60 * 60 * 1000 }),
  REFRESH_TOKEN_MAX_AGE: num({ default: 30 * 24 * 60 * 60 * 1000 }),
  POSTGRES_USER: str(),
  POSTGRES_PASSWORD: str(),
  POSTGRES_DB: str(),
  POSTGRES_HOST: str({ default: 'localhost' }),
  POSTGRES_PORT: num({ default: 5432 }),
  POSTGRES_MAX_POOL_SIZE: num({ default: 20 }),
  POSTGRES_DB_SSL: str({ default: "false", choices: ["true", "false"] }),
  MONGO_URI: str({ default: "mongodb://chatbot-mongo:27017/chatbotdb" }),
  REDIS_URL: str({ default: "redis://localhost:6379" }),
  OPENAI_API_KEY: str(),
  HOST: host({ default: "localhost" }),
  PORT: port({ default: 5001 }),
  CORS_ORIGIN: str(),
  COMMON_RATE_LIMIT_MAX_REQUESTS: num({ default: 1000 }),
  COMMON_RATE_LIMIT_WINDOW_MS: num({ default: 1000 }),
  EMAIL_USER: str(),
  EMAIL_PASSWORD: str(),
  SERP_API_KEY: str(),
  OPENAI_ASSISTANT_ID: str(),
  JWT_ACCESS_TOKEN_EXPIRATION_TIME: num({ default: 30 * 1000 }),
  CHATBOT_ID: num({ default: 999999 }),
  OTP_EXPIRATION_TIME: num({ default: 5 * 60 * 1000 }),
  CHATBOT_USER_ID: num({ default: 999999 }),
  REDIS_HOST: str({ default: 'redis' }),
  REDIS_PORT: num({ default: 6379 }),
  REDIS_PASSWORD: str({ default: 'redis' }),
  BANK_ACC: str(),
  BANK_NAME: str(),
  GOOGLE_CLIENT_ID: str()
});
