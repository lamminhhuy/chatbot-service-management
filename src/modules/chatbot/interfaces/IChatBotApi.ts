import { Message } from "@/shared/entites/Message";
import { ChatCompletionMessageParam } from "openai/resources/chat";


export interface IChatbotAPI {
  generateResponse(messages: ChatCompletionMessageParam[]): Promise<string>;
  generateEmbedding(text: string): Promise<number[]>;
}
