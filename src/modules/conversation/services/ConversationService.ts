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
import { isUserRole } from "@/modules/auth/middlewares/role.utils";
import { env } from "@/configs/envConfig";
import { groupBy } from 'lodash';
import dayjs from 'dayjs'; 
import { ITokenLimiter } from "../interfaces/ITokenLimiter";
import { ConversationQueryParamsDTO } from "../dtos/ConsersationQueryParams";
import { PaginatedResponse, PaginatedResponseSchema } from "@/shared/dtos/PaginatedResponse.dto";
import { ConversationReponseDTO, ConversationReponseDTOSchema } from "../dtos/ConversationResponse.dto";
import { buildPaginatedResponse } from "@/shared/utils/buildPaginatedResponse";

@injectable()
export class ConversationService {
    constructor(
        @inject('IConversationRepository') private conversationRepository: IConversationRepository,
        @inject('IMessageRepository') private messageRepository: IMessageRepository,
        @inject(ChatbotService) private chatBotService: ChatbotService,
        @inject('ITokenLimiter') private tokenLimiter: ITokenLimiter) {
    }
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
                },
                order: {
                    createdAt: 'DESC' 
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

        const chatbot =await  this.chatBotService.getChatbot();
        if(!chatbot) {
            throw new Error('Chatbot not found');
        }
        const chatBotResponseMessage = Message.createMessage(chatBotMessageContent,chatbot,ChatRole.Assistant, 
        savedConversation);
        
        const messages = await this.messageRepository.save([newUserMessage, chatBotResponseMessage]);
        conversation.messages  = messages;

       await this.tokenLimiter.decreToken(authUser.id);

        return conversation;
    }

    async createMessage(conversationId: number, message: CreateMessageDTO, user: User): Promise<Message[]> {
        const conversation = await this.conversationRepository.findOneBy({id:conversationId});
        if (!conversation) throw new BadRequestResponseError('Conversation not found');
        const newUserMessage = Message.createMessage(message.content, user, isUserRole(user.roles) ? ChatRole.User : ChatRole.Assistant, conversation);
      
        const chatBotMessageContent = await this.chatBotService.handleAuthenticatedUserQuery([newUserMessage]);
        const chatbot =await  this.chatBotService.getChatbot();
        const chatBotResponseMessage = Message.createMessage(chatBotMessageContent,chatbot,ChatRole.Assistant, 
            conversation);
       
        await this.tokenLimiter.decreToken(user.id);
                 
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
    getAllConversations(): Promise<Conversation[]> {
        return this.conversationRepository.find();
    }
    async getPaginatedConversations(queryParams: ConversationQueryParamsDTO): Promise<PaginatedResponse<ConversationReponseDTO>> {
        const {items, total} = await this.conversationRepository.getPaginatedConversations(queryParams);
        const panigatedData =buildPaginatedResponse({
            items,
            meta:{
                total,
                limit: queryParams.limit,
                offset: queryParams.offset
            }
        });
        return PaginatedResponseSchema(ConversationReponseDTOSchema).parse(panigatedData);
    }
}
