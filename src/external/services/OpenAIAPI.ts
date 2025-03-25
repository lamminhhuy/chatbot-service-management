import { IChatbotAPI } from "@/modules/chatbot/interfaces/IChatBotApi";
import {
  BadRequestResponseError,
  ErrorsResponse,
} from "@/shared/response/errors.response";
import { StatusCode } from "@/shared/types/statusCode";
import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources/chat";

export class OpenAIAPI implements IChatbotAPI {
  private openai: OpenAI;

  constructor(private readonly apiKey: string) {
    this.openai = new OpenAI({
      apiKey: this.apiKey,
    });
  }

  async generateEmbedding(text: string): Promise<number[]> {
    const response = await this.openai.embeddings.create({
      model: "text-embedding-3-small",
      input: text,
    });
    return response.data[0].embedding;
  }

  async generateResponse(
    messages: ChatCompletionMessageParam[]
  ): Promise<string> {

    try {
      const completion = await this.openai.chat.completions.create({
        model: "gpt-4.5-preview-2025-02-27",
        messages: messages,
        temperature: 0.7,
      });

      const response = completion.choices[0]?.message?.content;

      if (!response) {
        throw new ErrorsResponse(
          "Invalid or empty response from OpenAI API.",
          StatusCode.CONFLICT
        );
      }

      return response;
    } catch (error) {
      console.error("Error in generateResponse:", error);
      throw new BadRequestResponseError(
        "Failed to generate response from OpenAI API."
      );
    }
  }

  
}