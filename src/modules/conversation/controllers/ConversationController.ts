import { inject, injectable } from "tsyringe";
import { ConversationService } from "../services/ConversationService";
import { Response } from "express";
import { CreateConversationDTO } from "../dtos/CreateConversation.dto";
import { SuccessResponse } from "@/shared/response/success.response";
import { CreateMessageDTO } from "../dtos/CreateMessage.dto";
import { ConversationReponseDTOSchema, ConversationsReponseDTOSchema, CreateConversationReponseDTOSchema } from "../dtos/ConversationResponse.dto";
import { CustomRequest } from "@/shared/interfaces/CustomRequest";
import { CreateMessageResponseDTOSchema } from "../dtos/MessageResponse.dto";

@injectable()
export class ConversationController {
    constructor(@inject(ConversationService) private conversationService: ConversationService) {}
    async handleCreateConversation (req: CustomRequest<{},{},CreateConversationDTO>, res: Response) {
    const result = await this.conversationService.createConversation(req.body, req.user);
    return new SuccessResponse({ data:CreateConversationReponseDTOSchema.parse(result)}).send(res);
    }
    async handleGetConversations (req: CustomRequest, res: Response) {
    const result = await this.conversationService.getConversations(req.user.id);
    return new SuccessResponse({ data: ConversationsReponseDTOSchema.parse(result) }).send(res);
    }

    async handleGetConversationById (req: CustomRequest<{ id: string }>, res: Response) {
    const result = await this.conversationService.getConversationById(Number(req.params.id));
    return new SuccessResponse({ data: ConversationReponseDTOSchema.parse(result) }).send(res);
    }
    async handleCreateMessage (req: CustomRequest<{ id: string },{},CreateMessageDTO>, res: Response) {
    const result = await this.conversationService.createMessage(Number(req.params.id), req.body, req.user);
    return new SuccessResponse({ data:CreateMessageResponseDTOSchema.parse(result)}).send(res);
    }
    async handleDeleteConversation (req: CustomRequest<{ id: string }>, res: Response) {
    const result = await this.conversationService.deleteConversation(Number(req.params.id), req.user.id);
    return new SuccessResponse({ message: 'Conversation deleted successfully!' }).send(res);
    }
    async handleGetAllConversations (req: CustomRequest, res: Response) {
    const result = await this.conversationService.getAllConversations();
    return new SuccessResponse({ data: ConversationsReponseDTOSchema.parse(result) }).send(res);
    }
}