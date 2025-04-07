import { env } from "@/configs/envConfig";
import { redisInstance } from "@/database/redisClient";
import { Router } from "express";
import { ChatbotService } from "../services/ChatbotService";
import { ChatController } from "../controllers/ChatbotController";
import {  chatRequestSchema } from "../validators/ChatValidator";
import { OpenAIAPI } from "@/infrastructure/ai/OpenAIAPI";
import { OpenAIMessageAdapter } from "../helpers/OpenAIMessageAdapter";
import { WebSearchService } from "@/infrastructure/search/WebSearchService";
import { RedisSessionStore } from "@/infrastructure/session/RedisSessionStore";
import { validateRequest } from "@/shared/middlewares/validateRequest/validateRequest";
import { ModuleConfig } from "@/modules/auth/interfaces/ModuleConfig";

const chatRouter = Router();
const sessionStore = new RedisSessionStore(redisInstance);
const webSearchService = new WebSearchService(env.SERP_API_KEY);
const chatbotAPI = new OpenAIAPI(env.OPENAI_API_KEY, env.OPENAI_ASSISTANT_ID, webSearchService);
const messageAdapter = new OpenAIMessageAdapter()
const chatbotService = new ChatbotService(chatbotAPI, sessionStore,messageAdapter);
const chatController = new ChatController(chatbotService);

export const chatModule: ModuleConfig = {
  prefix: "/chat",
  routes: [
    {
      method: 'post',
      path: '/',
      handler: chatController.handleChat.bind(chatController),
      middlewares: [validateRequest(chatRequestSchema)]
    }
  ]
} ;