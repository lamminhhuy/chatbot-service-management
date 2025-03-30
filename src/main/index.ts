import { env } from "../configs/envConfig";
import { app, logger } from "./app";
import https from "https";
import http from "http"; 
import fs from "fs";

const isHttpsEnv = ["pro","test"].includes(env.NODE_ENV)

let credentials = {};
if (isHttpsEnv) {
  const privateKey = fs.readFileSync(
    "/etc/letsencrypt/live/api.logisticchatbot.com/privkey.pem",
    "utf8"
  );
  const certificate = fs.readFileSync(
    "/etc/letsencrypt/live/api.logisticchatbot.com/fullchain.pem",
    "utf8"
  );
  credentials = { key: privateKey, cert: certificate };
}

let server;
if (isHttpsEnv) {
  server = https.createServer(credentials, app);
  server.listen(443, () => {
    logger.info("HTTPS Server running on port 443");
  });
} else {
  server = http.createServer(app);
  server.listen(env.PORT, () => {
    const { NODE_ENV, HOST, PORT } = env;
    logger.info(`Server (${NODE_ENV}) running on port http://${HOST}:${PORT}`);
  });
}

const onCloseSignal = () => {
  logger.info("sigint received, shutting down");
  server.close(() => {
    logger.info("server closed");
    process.exit();
  });
  setTimeout(() => process.exit(1), 10000).unref(); 
};

process.on("SIGINT", onCloseSignal);
process.on("SIGTERM", onCloseSignal);