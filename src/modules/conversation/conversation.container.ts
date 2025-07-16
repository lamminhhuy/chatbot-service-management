import { container } from "tsyringe";
import { ConversationService } from "./services/ConversationService";
import { ConversationRepository } from "./repository/ConversationRepository";
import { Message } from "./models/Message";
import { AppDataSource } from "@/shared/infrastructure/database/PostgresDB";


export function registerConversationDependencies () {
container.register('IConversationRepository', { useClass: ConversationRepository })
container.register(ConversationService, { useClass: ConversationService })
container.register('IMessageRepository', { useValue: AppDataSource.getRepository(Message)}) 
}

export const conversationContainer = container
