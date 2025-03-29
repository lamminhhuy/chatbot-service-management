import { Message } from "@/shared/entites/Message";
import { ThreadCreateParams } from "openai/resources/beta/threads/threads";
import { ChatCompletionMessageParam } from "openai/resources/chat";


export interface IChatbotAPI {
  generateResponse(messages:ChatCompletionMessageParam[]): Promise<string>;
  generateEmbedding(text: string): Promise<number[]>;
}
