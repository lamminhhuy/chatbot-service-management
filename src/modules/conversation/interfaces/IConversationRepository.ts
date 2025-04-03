import { Repository } from "typeorm";
import { Conversation } from "../models/Conversation";

export interface IConversationRepository extends Repository<Conversation> {
    createConversation: (data: any) => Promise<any>;
}