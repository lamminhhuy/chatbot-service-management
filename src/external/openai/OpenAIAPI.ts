import { IChatbotAPI } from "@/modules/chatbot/interfaces/IChatBotApi";
import {
  BadRequestResponseError,
  ErrorsResponse,
} from "@/shared/response/errors.response";
import { StatusCode } from "@/shared/types/statusCode";
import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources/chat";
import { IWebSearchService } from "./interfaces/IWebSearchService";

export class OpenAIAPI implements IChatbotAPI {
private openai: OpenAI;
  private assistantId?: string;
  private webSearchService: IWebSearchService
  private readonly assistantInstructions: string = `Lưu ý: bạn cần trả lời cực kỳ chi tiết, càng chi tiết càng tốt. Nếu câu hỏi liên quan đến xuất khẩu từ Việt Nam sang 1 nước khác thì hãy trả lời bao gồm các nội dung sau: Mã HS và Chính sách Thuế:
  Mã HS cụ thể cho mặt hàng. Các mức thuế liên quan: thuế xuất khẩu, thuế VAT. Dẫn chiếu thông tư, nghị định làm căn cứ pháp lý.
Yêu cầu về vùng trồng và đóng gói.
Mã số do Cục Bảo vệ Thực vật Việt Nam cập nhật.
Tiêu chuẩn chất lượng:
Về hình thức, trọng lượng, độ chín, màu sắc, trạng thái ruột...
Phân loại size (S, M, L) theo gram.
Hồ sơ hải quan cần thiết:
Tờ khai, hợp đồng, hóa đơn, vận đơn, packing list...
Giấy tờ kiểm dịch, C/O, hun trùng nếu cần.
Thủ tục kiểm dịch thực vật:
Đăng ký và cung cấp mẫu để kiểm tra.
Nhận giấy chứng nhận nếu đạt yêu cầu`

  constructor(apiKey: string, assistantId: string, webSearchService: IWebSearchService ) {
    this.openai = new OpenAI({
      apiKey: apiKey,
    });
    this.webSearchService = webSearchService
    this.assistantId = assistantId;
  }

  async generateEmbedding(text: string): Promise<number[]> {
    try {
      const response = await this.openai.embeddings.create({
        model: "text-embedding-3-small",
        input: text,
      });
      return response.data[0].embedding;
    } catch (error) {
      console.error("Error in generateEmbedding:", error);
      throw new BadRequestResponseError(
        "Failed to generate embedding from OpenAI API."
      );
    }
  }


  async generateResponse(
    messages: ChatCompletionMessageParam[]
  ): Promise<string> {
    try {
      const chatMessages: ChatCompletionMessageParam[] = [];
      chatMessages.push(...messages)

      if (this.assistantId) {
        const assistant = await this.openai.beta.assistants.retrieve(
          this.assistantId
        );
        if (assistant.instructions) {
          chatMessages.push({
            role: "system",
            content: assistant.instructions + this.assistantInstructions
          });
        }
      }

      const lastMessage = messages[messages.length - 1];
      let webSearchResults = "";
      
      if (lastMessage.role === "user") {
   
        webSearchResults = await this.webSearchService.search(lastMessage.content as string);

        if(webSearchResults)
        {
        chatMessages.push({
          role: "system",
          content: `Kết quả tìm kiếm web:\n${webSearchResults}. `,
        });
        }
      }

      const completion = await this.openai.chat.completions.create({
        model: "gpt-4o",
        messages: chatMessages,
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