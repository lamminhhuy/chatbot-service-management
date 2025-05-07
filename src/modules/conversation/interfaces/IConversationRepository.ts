import { Repository } from "typeorm";
import { Conversation } from "../models/Conversation";
import { ConversationQueryParamsDTO } from "../dtos/ConsersationQueryParams";

export interface IConversationRepository extends Repository<Conversation> {
    createConversation: (data: any) => Promise<any>;
    getPaginatedConversations: (queryParams: ConversationQueryParamsDTO) => Promise<Conversation[]>;
}