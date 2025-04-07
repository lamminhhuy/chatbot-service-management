import { validateRequest } from "@/shared/middlewares/validateRequest/validateRequest";
import { CreateConversationDTOSchema } from "../dtos/CreateConversation.dto";
import { ConversationController } from "../controllers/ConversationController";
import { container } from "tsyringe";
import { CreateMessageDTOSchema } from "../dtos/CreateMessage.dto";
import { ModuleConfig } from "@/modules/auth/interfaces/ModuleConfig";

const conversationController = container.resolve(ConversationController)

export const conversationModule: ModuleConfig = {
    prefix: "/conversations",
    routes: [
        {
            method: 'post',
            path: '/',
            handler: conversationController.handleCreateConversation.bind(conversationController),
            middlewares: [validateRequest(CreateConversationDTOSchema)]
        },
        {
            method: 'post',
            path: '/:id/messages',
            handler: conversationController.handleCreateMessage.bind(conversationController),
            middlewares: [validateRequest(CreateMessageDTOSchema)]
        },
        {
            method: 'get',
            path: '/',
            handler: conversationController.handleGetConversations.bind(conversationController)
        },
        {
            method: 'get',
            path: '/:id',
            handler: conversationController.handleGetConversationById.bind(conversationController)
        },
        {
            method: 'delete',
            path: '/:id',
            handler: conversationController.handleDeleteConversation.bind(conversationController)
        }
    ]
} ;