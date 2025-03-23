import { GoogleGeminiAPI } from "@/external/services/GoogleGeminiApi";
import { Request, Response, Router } from "express";
import { validateRequest } from "@/shared/middlewares/validateRequest/validateRequest";
import { env } from "@/configs/envConfig";
import { redisInstance } from "@/database/redisClient";
import asyncHandler from "@/shared/utils/asyncHandler";
import { VectorRepositoryImpl } from "@/modules/qAVector/repositories/VectorRepository";
import { VectorService } from "@/modules/qAVector/services/VectorService";
import { ChatbotService } from "../services/ChatbotService";
import { RedisSessionStore } from "@/shared/repositories/RedisSessionStore";
import { ChatController } from "../controllers/ChatbotController";
import {  chatRequestSchema } from "../validators/ChatValidator";
import { OpenAIAPI } from "@/external/services/OpenAIAPI";
import { MessageOpenAIAdapter } from "../helpers/MessageOpenAIAdapter";

const chatRouter = Router();
const sessionStore = new RedisSessionStore(redisInstance);
const chatbotAPI = new OpenAIAPI(env.OPENAI_API_KEY);
const vectorRepository = new VectorRepositoryImpl()
const messageAdapter = new MessageOpenAIAdapter()
const vectorService = new VectorService(vectorRepository,chatbotAPI)
const chatbotService = new ChatbotService(chatbotAPI, sessionStore,vectorService,messageAdapter);
const chatController = new ChatController(chatbotService);

chatRouter.post(
  "/",
  validateRequest(chatRequestSchema),asyncHandler(chatController.handleChat.bind(chatController))
);

export default chatRouter;
