
import { Role } from "@/shared/enums/Role";
import { VectorService } from "../../qAVector/services/VectorService";
import { IChatbotAPI } from "@/modules/chatbot/interfaces/IChatBotApi";
import { ISessionStore } from "@/shared/interfaces/repositories/ISessionStore";
import { Session } from "@/shared/entites/Session";
import { Author } from "@/shared/entites/Author";
import { ChatRole } from "../enums/ChatRole";
import { Message } from "../models/MessageModel";
import { SessionMessage } from "../types/SessionMessage";
import { IMessageAdapter } from "../interfaces/IMessageAdapter";
import { RedisSessionStore } from "@/infrastructure/session/RedisSessionStore";
import { redisInstance } from "@/database/redisClient";

export class ChatbotService {

  constructor(
    private chatbotAPI: IChatbotAPI,
    private sessionStore: ISessionStore,
    private vectorService: VectorService,
    private messageAdapter:IMessageAdapter
  ) {
  }

  async handleUserQuery(sessionId: string, content: string) {

    const session = await this.getOrCreateSession(sessionId);
    // const relevantInfo = await this.retrieveRelevantInformation(content)

    // const augmentedQuery = relevantInfo
    // ? `You are an expert AI. I have the following information: ${relevantInfo}.\n Question: ${content}.\n 
    // Please provide a concise and accurate answer based on the information above.`
    // : content;

    const userMessage = this.createSessionMessage(content, ChatRole.User);
    session.addMessage(userMessage);

    const responseMessage = await this.chatbotAPI.generateResponse(session.messages.map((message) => this.messageAdapter.toOpenAi(message)));
   
    session.addMessage({role: ChatRole.Assistant, content:responseMessage });

    await this.sessionStore.saveSession(session.id, session);

    return { message: responseMessage, sessionId: session.id };
  }

  private async getOrCreateSession(sessionId: string): Promise<Session> {
    const existingSession = await this.sessionStore.getSession(sessionId);
    return existingSession ?? new Session();
  }

  private createSessionMessage(content: string, role: ChatRole): SessionMessage {
    return {content,role};
  }

  private async retrieveRelevantInformation(content: string): Promise<string | null> {
    const bestMatch = await this.vectorService.findBestMatch(content);
    return bestMatch ? bestMatch.answer : null;
  }
}
