import { Request, Response, Router } from "express";
import { validateRequest } from "@/shared/middlewares/validateRequest/validateRequest";
import { env } from "@/configs/envConfig";
import { redisInstance } from "@/database/redisClient";
import asyncHandler from "@/shared/utils/asyncHandler";
import { VectorRepositoryImpl } from "@/modules/qAVector/repositories/VectorRepository";
import { VectorService } from "@/modules/qAVector/services/VectorService";
import { ChatbotService } from "../services/ChatbotService";
import { ChatController } from "../controllers/ChatbotController";
import {  chatRequestSchema } from "../validators/ChatValidator";
import { OpenAIAPI } from "@/infrastructure/ai/OpenAIAPI";
import { OpenAIMessageAdapter } from "../helpers/OpenAIMessageAdapter";
import { WebSearchService } from "@/infrastructure/search/WebSearchService";
import { RedisSessionStore } from "@/infrastructure/session/RedisSessionStore";

const chatRouter = Router();
const sessionStore = new RedisSessionStore(redisInstance);
const webSearchService = new WebSearchService(env.SERP_API_KEY);
const chatbotAPI = new OpenAIAPI(env.OPENAI_API_KEY, env.OPENAI_ASSISTANT_ID, webSearchService);
const vectorRepository = new VectorRepositoryImpl()
const messageAdapter = new OpenAIMessageAdapter()
const vectorService = new VectorService(vectorRepository,chatbotAPI)
const chatbotService = new ChatbotService(chatbotAPI, sessionStore,vectorService,messageAdapter);
const chatController = new ChatController(chatbotService);

chatRouter.post(
  "/",
  validateRequest(chatRequestSchema),asyncHandler(chatController.handleChat.bind(chatController))
);

export default chatRouter;
