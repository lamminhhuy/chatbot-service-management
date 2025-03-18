import { GoogleGeminiAPI } from "@/external/services/GoogleGeminiApi";
import { Request, Response, Router } from "express";
import { validateRequest } from "@/shared/middlewares/validateRequest/validateRequest";
import { env } from "@/configs/envConfig";
import { redisInstance } from "@/shared/utils/redisClient";
import asyncHandler from "@/shared/utils/asyncHandler";
import { VectorRepositoryImpl } from "@/modules/qAVector/repositories/VectorRepository";
import { VectorService } from "@/modules/qAVector/services/VectorService";
import { ChatbotService } from "../services/ChatbotService";
import { RedisSessionStore } from "@/database/RedisSessionStore";
import { ChatController } from "../controllers/ChatbotController";
import {  chatRequestSchema } from "../validators/ChatValidator";

const chatRouter = Router();
const sessionStore = new RedisSessionStore(redisInstance);
const chatbotAPI = new GoogleGeminiAPI(env.GOOGLE_GEMINI_API_KEY);
const vectorRepository = new VectorRepositoryImpl()
const vectorService = new VectorService(vectorRepository,chatbotAPI)
const chatbotService = new ChatbotService(chatbotAPI, sessionStore,vectorService);
const chatController = new ChatController(chatbotService);

chatRouter.post(
  "/",
  validateRequest(chatRequestSchema),
  asyncHandler((req: Request, res: Response) =>
    chatController.handleChat(req, res)
  )
);

export default chatRouter;
