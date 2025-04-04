import { inject, injectable } from "tsyringe";
import { ConversationService } from "../services/ConversationService";
import { Response } from "express";
import { CreateConversationDTO } from "../dtos/CreateConversation.dto";
import { SuccessResponse } from "@/shared/response/success.response";
import { CreateMessageDTO } from "../dtos/CreateMessage.dto";
import { ConversationReponseDTOSchema, ConversationsReponseDTOSchema, CreateConversationReponseDTOSchema } from "../dtos/ConversationResponse.dto";
import { AuthenticatedRequest } from "@/shared/interfaces/AuthenticatedRequest";
import { CreateMessageResponseDTOSchema } from "../dtos/MessageResponse.dto";

@injectable()
export class ConversationController {
    constructor(@inject(ConversationService) private conversationService: ConversationService) {}
   async handleCreateConversation (req: AuthenticatedRequest<{},{},CreateConversationDTO>, res: Response) {
    const result = await this.conversationService.createConversation(req.body, req.user);
    const formattedData = CreateConversationReponseDTOSchema.parse({
        conversation:result,
        assistantResponse:{message:result.messages[1]},
    })
   return new SuccessResponse({ data:formattedData}).send(res);
}
    async handleGetConversations (req: AuthenticatedRequest, res: Response) {
     const result = await this.conversationService.getConversations(req.user.id);
     return new SuccessResponse({ data: ConversationsReponseDTOSchema.parse(result) }).send(res);
    }

    async handleGetConversationById (req: AuthenticatedRequest<{ id: string }>, res: Response) {
        const result = await this.conversationService.getConversationById(Number(req.params.id));
        return new SuccessResponse({ data: ConversationReponseDTOSchema.parse(result) }).send(res);
    }
   async handleCreateMessage (req: AuthenticatedRequest<{ id: string },{},CreateMessageDTO>, res: Response) {
    const result = await this.conversationService.createMessage(Number(req.params.id), req.body, req.user);
    const formattedData = CreateMessageResponseDTOSchema.parse({
        message:result[0],
        assistantResponse:{message:result[1]},
    })
    return new SuccessResponse({ data:formattedData}).send(res);
   }
    async handleDeleteConversation (req: AuthenticatedRequest<{ id: string }>, res: Response) {
        const result = await this.conversationService.deleteConversation(Number(req.params.id), req.user.id);
        return new SuccessResponse({ message: 'Conversation deleted successfully!' }).send(res);
    }
}