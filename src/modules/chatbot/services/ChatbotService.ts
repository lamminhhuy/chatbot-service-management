
import { Role } from "@/shared/enums/Role";
import { VectorService } from "../../qAVector/services/VectorService";
import { IChatbotAPI } from "@/modules/chatbot/interfaces/IChatBotApi";
import { ISessionStore } from "@/shared/interfaces/repositories/ISessionStore";
import { Session } from "@/shared/entites/Session";
import { SessionMessage } from "../types/SessionMessage";
import { IMessageAdapter } from "../interfaces/IMessageAdapter";
import { ChatRole } from "@/modules/conversation/enums/ChatRole";
import { Message } from "@/modules/conversation/models/Message";
import { inject, injectable } from "tsyringe";
import { UserService } from "@/modules/user/services/UserService";
import { env } from "@/configs/envConfig";
import RedisClient from "@/database/redisClient";
import Redis from "ioredis";
import { User } from "@/modules/user/models/UserModel";
import { UserSubscription } from "@/modules/subscription/models/UserSubscription";
import { NotFoundResponseError } from "@/shared/response/errors.response";

@injectable()
export class ChatbotService {

  constructor(
   @inject('IChatbotAPI') private chatbotAPI: IChatbotAPI,
   @inject('ISessionStore') private sessionStore: ISessionStore,
   @inject(Redis) private redisClient: Redis,
   @inject('IMessageAdapter') private messageAdapter:IMessageAdapter,
   @inject(UserService) private userService: UserService
  ) {
  }
  async handleAuthenticatedUserQuery(messages: Message[]): Promise<string> {
   return  this.chatbotAPI.generateResponse(messages.map((message) => this.messageAdapter.toOpenAi(message)));
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

  public async getChatbot(): Promise<User> {
    const cacheKey = 'chatbot'
    const cached = await this.redisClient.get(cacheKey)
    if (cached) {
      return JSON.parse(cached) as User;
    }
    const chatbot = await this.userService.findUserById(env.CHATBOT_USER_ID)
    if (!chatbot) {
      throw new NotFoundResponseError("Chatbot user not found");
    }
    this.redisClient.set(cacheKey, JSON.stringify(chatbot))
    return chatbot;
  }

}
