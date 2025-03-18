import { IChatbotAPI } from "@/modules/chatbot/interfaces/IChatBotApi";
import { IVectorRepository } from "@/shared/interfaces/repositories/IVectorRepository";

export class VectorService {
    constructor(
      private dbService: IVectorRepository,
      private embeddingService: IChatbotAPI,
    ) {}
  
    async findBestMatch(content: string) {
      const queryEmbedding = await this.embeddingService.generateEmbedding(content);
      return await this.dbService.findSimilarQuestions(queryEmbedding);  
    }
  }
  