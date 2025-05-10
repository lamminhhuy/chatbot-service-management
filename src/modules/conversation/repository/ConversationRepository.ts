import { Repository } from "typeorm";
import { Conversation } from "../models/Conversation";
import { IConversationRepository } from "../interfaces/IConversationRepository";
import { AppDataSource } from "@/database/PostgresDB";
import { ConversationQueryParamsDTO } from "../dtos/ConsersationQueryParams";

export class ConversationRepository extends Repository<Conversation> implements IConversationRepository {
    constructor() {
        super(Conversation, AppDataSource.manager); 
    }

    async createConversation(data: Conversation): Promise<Conversation> {
        return this.save(data);
    }
    async getPaginatedConversations(queryParams: ConversationQueryParamsDTO): Promise<{ items: Conversation[], total: number }> {
        const { limit, offset, search, sort } = queryParams;
        const queryBuilder = this.createQueryBuilder('conversation');
    
        if (search) {
            queryBuilder.andWhere('conversation.title ILIKE :search', { search: `%${search}%` });
        }
    
        if (sort) {
            queryBuilder.orderBy('conversation.createdAt', sort as 'ASC' | 'DESC');
        }
    
        queryBuilder
            .leftJoinAndSelect('conversation.users', 'user', 'user.deletedAt IS NULL')
            .innerJoinAndSelect('conversation.messages', 'message') 
            .innerJoinAndSelect('message.sender', 'sender', 'sender.deletedAt IS NULL') 
            .skip(offset)
            .take(limit);
    
        const [items, total] = await queryBuilder.getManyAndCount();
    
        return { items, total };
    }
}