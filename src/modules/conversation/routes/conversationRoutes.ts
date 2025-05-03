import { validateRequest } from "@/shared/middlewares/validateRequest/validateRequest";
import { CreateConversationDTOSchema } from "../dtos/CreateConversation.dto";
import { ConversationController } from "../controllers/ConversationController";
import { container } from "tsyringe";
import { CreateMessageDTOSchema } from "../dtos/CreateMessage.dto";
import { ModuleConfig } from "@/modules/auth/interfaces/ModuleConfig";
import { validateQueryToken } from "../middlewares/validateQueryToken.middleware";

const conversationController = container.resolve(ConversationController)

export const conversationModule: ModuleConfig = {
    prefix: "/conversations",
    moduleName: 'conversation',
    routes: [
        {
            method: 'POST',
            path: '/',
            handler: { controller: 'conversation',
                action:  conversationController.handleCreateConversation.bind(conversationController)},
            middlewares: [validateRequest(CreateConversationDTOSchema),validateQueryToken]
        },
        {
            method: 'POST',
            path: '/:id/messages',
            handler: { controller: 'conversation',
                action:  conversationController.handleCreateMessage.bind(conversationController)},
            middlewares: [validateRequest(CreateMessageDTOSchema), validateQueryToken]
        },
        {
            method: 'GET',
            path: '/user',
            handler: { controller: 'conversation',
                action:  conversationController.handleGetConversations.bind(conversationController)}
        },
        {
            method: 'GET',
            path: '/',
            handler: { controller: 'conversation',
                action:  conversationController.handleGetAllConversations.bind(conversationController)}
        },
        {
            method: 'GET',
            path: '/:id',
            handler: { controller: 'conversation',
                action:  conversationController.handleGetConversationById.bind(conversationController)}
        },
        {
            method: 'DELETE',
            path: '/:id',
            handler: { controller: 'conversation',
                action:  conversationController.handleDeleteConversation.bind(conversationController)}
        }
    ]
} ;