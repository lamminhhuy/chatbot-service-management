import { validateRequest } from "@/shared/middlewares/validateRequest/validateRequest";
import asyncHandler from "@/shared/utils/asyncHandler";
import  { Router } from "express";
import { CreateConversationDTOSchema } from "../dtos/CreateConversation.dto";
import { ConversationController } from "../controllers/ConversationController";
import { container } from "tsyringe";
import { CreateMessageDTOSchema } from "../dtos/CreateMessage.dto";

export const conversationRouter = Router();
const conversationController = container.resolve(ConversationController)

conversationRouter.post('/', 
validateRequest(CreateConversationDTOSchema), 
asyncHandler(conversationController.handleCreateConversation.bind(conversationController)));

// conversationRouter.post('/:id/messages', 
// validateRequest(CreateMessageDTOSchema), 
// asyncHandler(conversationController.handleCreateMessage.bind(conversationController)));