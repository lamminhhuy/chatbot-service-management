import { inject, injectable } from "tsyringe";
import { CreateConversationDTO } from "../dtos/CreateConversation.dto";
import { IConversationRepository } from "../interfaces/IConversationRepository";
import { Conversation } from "../models/Conversation";
import { Message } from "../models/Message";
import { CreateMessageDTO } from "../dtos/CreateMessage.dto";
import { Repository } from "typeorm";
import { IMessageRepository } from "../interfaces/IMessageRepository";
import { BadRequestError } from "openai";
import { BadRequestResponseError } from "@/shared/response/errors.response";
import { ChatbotService } from "@/modules/chatbot/services/ChatbotService";
import { User } from "@/modules/user/models/UserModel";
import { ChatRole } from "../enums/ChatRole";

@injectable()
export class ConversationService {
    constructor(
        @inject('IConversationRepository') private conversationRepository: IConversationRepository,
        @inject('IMessageRepository') private messageRepository: IMessageRepository,
        @inject(ChatbotService) private chatBotService: ChatbotService) {}
    async getConversations(): Promise<Conversation[]> {
        return await this.conversationRepository.find();
    }
    async createConversation({ initialMessage }:CreateConversationDTO , authUser: User): Promise<Conversation> {
        
        const conversation =  Conversation.createConversation(initialMessage.content);
        const savedConversation = await this.conversationRepository.createConversation(conversation);
        const newUserMessage =  Message.createMessage(initialMessage.content, authUser, initialMessage.role,savedConversation);
        const chatBotMessageContent = await this.chatBotService.handleAuthenticatedUserQuery([newUserMessage]);
        const chatBotResponseMessage = Message.createMessage(chatBotMessageContent, User.getChatBot(),ChatRole.Assistant, 
        savedConversation);
    
        const messages = await this.messageRepository.save([newUserMessage, chatBotResponseMessage]);
        conversation.messages  = messages;
        return conversation
    }

    // async createMessage(conversationId: number, message: CreateMessageDTO): Promise<Message> {
    //     const conversation = await this.conversationRepository.findOneBy({id:conversationId});
    //     if (!conversation) throw new BadRequestResponseError('Conversation not found');
    //     const messageEntity =Message.createMessage(message.content, message.senderId, message.role, conversation);
    //     return await this.messageRepository.save(messageEntity);
    // }
}
