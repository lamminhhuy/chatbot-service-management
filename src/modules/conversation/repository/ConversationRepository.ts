import { Repository } from "typeorm";
import { Conversation } from "../models/Conversation";
import { IConversationRepository } from "../interfaces/IConversationRepository";
import { AppDataSource } from "@/shared/infrastructure/database/PostgresDB";
import { ConversationQueryParamsDTO } from "../dtos/ConsersationQueryParams";

export class ConversationRepository extends Repository<Conversation> implements IConversationRepository {
    constructor() {
        super(Conversation, AppDataSource.manager); 
    }

    async createConversation(data: Conversation): Promise<Conversation> {
        return this.save(data);
    }
    async getPaginatedConversations(queryParams: ConversationQueryParamsDTO): Promise<{ items: Conversation[], total: number }> {
        const { limit, offset, search, sort, startDate, endDate } = queryParams;
        
    
        const queryBuilder = this.createQueryBuilder('conversation')
            .where('conversation.deletedAt IS NULL');
    
        if (startDate && endDate) {
            queryBuilder.andWhere(
                'conversation.createdAt BETWEEN :startDate AND :endDate',
                { startDate, endDate }
            );
        }
    
        if (search) {
            queryBuilder.andWhere(
                'sender.email ILIKE :search OR sender.username ILIKE :search',
                { search: `%${search}%` }
            );
        }
    
        if (sort) {
            if (!['ASC', 'DESC'].includes(sort)) {
                throw new Error('Sort must be either ASC or DESC');
            }
            queryBuilder.orderBy('conversation.createdAt', sort as 'ASC' | 'DESC');
        } else {
            queryBuilder.orderBy('conversation.createdAt', 'DESC');
        }
    
        queryBuilder
            .leftJoinAndSelect('conversation.users', 'user', 'user.deletedAt IS NULL')
            .leftJoinAndSelect('conversation.messages', 'message', 'message.deletedAt IS NULL')
            .innerJoinAndSelect('message.sender', 'sender')
            .andWhere('sender.deletedAt IS NULL')
            .skip(offset)
            .take(limit);
            const [items, total] = await queryBuilder.getManyAndCount();
            return { items, total };
      
    }
}