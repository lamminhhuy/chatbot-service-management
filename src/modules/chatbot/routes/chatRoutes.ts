import { env } from "@/shared/infrastructure/configs/envConfig";
import { redisInstance } from "@/shared/infrastructure/database/redisClient";
import { Router } from "express";
import { ChatbotService } from "../services/ChatbotService";
import { ChatController } from "../controllers/ChatbotController";
import {  chatRequestSchema } from "../validators/ChatValidator";
import { OpenAIAPI } from "@/external/openai/OpenAIAPI";
import { OpenAIMessageAdapter } from "../helpers/OpenAIMessageAdapter";
import { WebSearchService } from "@/external/web-search/WebSearchService";
import { validateRequest } from "@/shared/middlewares/validateRequest/validateRequest";
import { ModuleConfig } from "@/modules/auth/interfaces/ModuleConfig";
import { container } from "tsyringe";

const chatController = container.resolve(ChatController);

export const chatModule: ModuleConfig = {
  prefix: "/chat",
  moduleName: "chat",
  routes: [
    {
      method: 'POST',
      path: '/',
      handler: { controller: 'chat',
                action:  chatController.handleChat.bind(chatController)},
      middlewares: [validateRequest(chatRequestSchema)]
    }
  ]
} ;