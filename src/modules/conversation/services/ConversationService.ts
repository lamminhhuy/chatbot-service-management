import { inject, injectable } from "tsyringe";
import { CreateConversationDTO } from "../dtos/CreateConversation.dto";
import { IConversationRepository } from "../interfaces/IConversationRepository";
import { Conversation } from "../models/Conversation";
import { Message } from "../models/Message";
import { CreateMessageDTO } from "../dtos/CreateMessage.dto";
import { Repository } from "typeorm";
import { IMessageRepository } from "../interfaces/IMessageRepository";
import { BadRequestResponseError } from "@/shared/response/errors.response";
import { ChatbotService } from "@/modules/chatbot/services/ChatbotService";
import { User } from "@/modules/user/models/UserModel";
import { ChatRole } from "../enums/ChatRole";
import { UserService } from "@/modules/user/services/UserService";
import { isUserRole } from "@/modules/auth/utils/role.utils";
import { env } from "@/configs/envConfig";

@injectable()
export class ConversationService {
    constructor(
        @inject('IConversationRepository') private conversationRepository: IConversationRepository,
        @inject('IMessageRepository') private messageRepository: IMessageRepository,
        @inject(ChatbotService) private chatBotService: ChatbotService,
        @inject(UserService) private userService: UserService) {}
        async getConversations(userId: number): Promise<Conversation[]> {
            const conversations = await this.conversationRepository.find({
                relations: {
                    users: true,
                    messages: {
                        sender: true,
                    }
                },
                where: {
                    users: {
                        id: userId
                    }
                }
            });
    
            if (!conversations || conversations.length === 0) {
                return [];
            }
            return conversations;
        }

    async getConversationById(conversationId: number): Promise<Conversation> {
        const conversation = await this.conversationRepository.findOne({
            relations: {
                users: true,
                messages: {
                    sender: true 
                }
            },
            where: {
                id: conversationId
            }
        });
        if (!conversation) {
            throw new BadRequestResponseError('Conversation not found');
        }
        return conversation;
    }
    async createConversation({ initialMessage }:CreateConversationDTO , authUser: User): Promise<Conversation> {
        
        const conversation =  Conversation.createConversation(initialMessage.content,[authUser]);
        const savedConversation = await this.conversationRepository.createConversation(conversation);

        const newUserMessage =  Message.createMessage(initialMessage.content, authUser, ChatRole.User, savedConversation);
        const chatBotMessageContent = await this.chatBotService.handleAuthenticatedUserQuery([newUserMessage]);

        const chatbot =await  this.userService.getProfile(env.CHATBOT_ID);
        const chatBotResponseMessage = Message.createMessage(chatBotMessageContent,chatbot,ChatRole.Assistant, 
        savedConversation);
        
        const messages = await this.messageRepository.save([newUserMessage, chatBotResponseMessage]);
        conversation.messages  = messages;
        return conversation
    }

    async createMessage(conversationId: number, message: CreateMessageDTO, user: User): Promise<Message[]> {
        const conversation = await this.conversationRepository.findOneBy({id:conversationId});
        if (!conversation) throw new BadRequestResponseError('Conversation not found');
        const newUserMessage = Message.createMessage(message.content, user, isUserRole(user.roles) ? ChatRole.User : ChatRole.Assistant, conversation);
      
        const chatBotMessageContent = await this.chatBotService.handleAuthenticatedUserQuery([newUserMessage]);
        const chatbot =await  this.userService.getProfile(env.CHATBOT_ID);
        const chatBotResponseMessage = Message.createMessage(chatBotMessageContent,chatbot,ChatRole.Assistant, 
            conversation);

       return await this.messageRepository.save([newUserMessage, chatBotResponseMessage]);
    }

    async deleteConversation(conversationId: number, userId: number): Promise<void> {
        const conversation = await this.conversationRepository.findOne({
            where: {
              id: conversationId,
              users: {
                id: userId,
              },
            },
            relations: ['messages', 'users']
          });
        if (!conversation) throw new BadRequestResponseError('Conversation not found');
        await this.conversationRepository.remove(conversation);
    }
    
}
