import { SuccessResponse } from "@/shared/response/success.response";
import { Request, Response } from "express";
import { ChatbotService } from "../services/ChatbotService";
import { IChatRequest } from "../dtos/ChatDTOs";

export class ChatController {
  constructor(private chatBotService: ChatbotService) {}

  async handleChat(req: Request<{},{},IChatRequest>, res: Response): Promise<void> {
    const { content } = req.body;
    const sessionId = req.cookies["sessionId"];
    const result = await this.chatBotService.handleUserQuery(sessionId, content);

    if (result.sessionId) {
      res.cookie("sessionId", result.sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000,
      });
    }

    new SuccessResponse({
      message: "Query executed successfully",
      data: { message: result.message },
    }).send(res);
  }
}
