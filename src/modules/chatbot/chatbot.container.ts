import { container } from "tsyringe";
import { ChatbotService } from "./services/ChatbotService";
import Redis from "ioredis";
import { UserService } from "../user/services/UserService";
import { OpenAIMessageAdapter } from "./helpers/OpenAIMessageAdapter";

export function registerChatbotDependencies (){
    container.register(ChatbotService,{useFactory: () => new ChatbotService(container.resolve('IChatbotAPI'),container.resolve('ISessionStore'),
    container.resolve(Redis), new OpenAIMessageAdapter(),
    container.resolve(UserService)
    )})
}