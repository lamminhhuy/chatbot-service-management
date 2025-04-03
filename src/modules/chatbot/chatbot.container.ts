import { container } from "tsyringe";
import { ChatbotService } from "./services/ChatbotService";
import { OpenAIMessageAdapter } from "./helpers/OpenAIMessageAdapter";

export function registerChatbotDependencies (){
    container.register(ChatbotService,{useFactory: () => new ChatbotService(container.resolve('IChatbotAPI'),container.resolve('ISessionStore'),
    new OpenAIMessageAdapter()
    )})
}