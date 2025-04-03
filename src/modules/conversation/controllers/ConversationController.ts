import { inject, injectable } from "tsyringe";
import { ConversationService } from "../services/ConversationService";
import { Request, Response } from "express";
import { CreateConversationDTO } from "../dtos/CreateConversation.dto";
import { SuccessResponse } from "@/shared/response/success.response";
import { CreateMessageDTO } from "../dtos/CreateMessage.dto";
import { ConversationReponseDTOSchema } from "../dtos/ConversationResponse.dto";
import { AuthenticatedRequest } from "@/shared/interfaces/AuthenticatedRequest";

@injectable()
export class ConversationController {
    constructor(@inject(ConversationService) private conversationService: ConversationService) {}
   async handleCreateConversation (req: AuthenticatedRequest<{},{},CreateConversationDTO>, res: Response) {
    const result = await this.conversationService.createConversation(req.body, req.user);
   return new SuccessResponse({ data: result}).send(res);
}

//    async handleCreateMessage (req: Request<{ id: string },{},CreateMessageDTO>, res: Response) {
//     const result = await this.conversationService.createMessage(Number(req.params.id), req.body);
//     return new SuccessResponse({ data: result }).send(res);
//    }
}