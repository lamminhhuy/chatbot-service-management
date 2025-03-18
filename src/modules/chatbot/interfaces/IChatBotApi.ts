import { Message } from "@/shared/entites/Message";


export interface IChatbotAPI {
  generateResponse(userInput: string, messages: Message[]): Promise<Message>;
  generateEmbedding(text: string): Promise<number[]>;
}
