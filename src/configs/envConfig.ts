import dotenv from "dotenv";
import { cleanEnv, host, num, port, str } from "envalid";

dotenv.config();

export const env = cleanEnv(process.env, {
  NODE_ENV: str({
    default: "dev",
    choices: ["dev", "pro", "test"],
  }),
  COOKIE_MAX_AGE: num({
   default: 30 * 24 * 60 * 60 * 1000 
  }),
  REFRESH_TOKEN_MAX_AGE: num({
default: 30 * 24 * 60 * 60 * 1000
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
  POSTGRES_DB_SSL: str({
    default: "false",
    choices: ["true", "false"],
  }),
  MONGO_URI: str({
    default: "mongodb://chatbot-mongo:27017/chatbotdb"
  }),
  REDIS_URL: str({
    default: "redis://localhost:6379", 
  }),
  OPENAI_API_KEY: str(),
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
  EMAIL_USER: str({
    default: 'admin@gmail.com'
  }),
  EMAIL_PASSWORD: str({
    default: '12345798'
  }),
  SERP_API_KEY: str({
    default: 'serp_api_key'
  }),
  OPENAI_ASSISTANT_ID: str({
    default: 'openai_assistant_id'
  }),
  JWT_ACCESS_TOKEN_EXPIRATION_TIME: num({
    default: 30 * 24 * 60 * 60 * 1000
  }),
  CHATBOT_ID: num({
    default: 999999
  }),
  OTP_EXPIRATION_TIME: num({
    default: 5 * 60 * 1000
  }),
  CHATBOT_USER_ID: num({
    default: 999999
  }),
  BANK_ACC: str(),
  BANK_NAME: str(),
  AWS_ACCESS_KEY_ID: str(),
  AWS_SECRET_ACCESS_KEY: str(),
  S3_BUCKET_NAME: str(),
  S3_REGION: str()
});
