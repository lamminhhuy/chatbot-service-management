
import { SuccessResponse } from "@/shared/response/success.response";import { Request, Response } from "express";
import { PromptService } from "../services/PromptServices";


export class PromptController {
 constructor(private promptService :PromptService){}
 async handleFetchAll (req: Request, res: Response){
  const prompts =  await this.promptService.handleFetchPrompt()
   new SuccessResponse({
    message: "Query executed successfully",
    data: {prompts},
  }).send(res);
 }
}
