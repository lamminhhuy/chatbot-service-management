import { Repository } from "typeorm";
import { Conversation } from "../models/Conversation";
import { IConversationRepository } from "../interfaces/IConversationRepository";
import { AppDataSource } from "@/database/PostgresDB";

export class ConversationRepository extends Repository<Conversation> implements IConversationRepository {
    constructor() {
        super(Conversation, AppDataSource.manager); 
    }
    async  createConversation(data: Conversation): Promise<Conversation>{
       return this.save(data);
    }
}
