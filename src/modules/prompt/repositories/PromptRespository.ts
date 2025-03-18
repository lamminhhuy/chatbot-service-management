import { Prompt } from "@/shared/entites/Prompt";
import { IPromptRepository } from "@/shared/interfaces/repositories/IPromptRepository";
import PromptModel from "../models/promtpModel";


export class PromptRespository implements IPromptRepository {
     async getPrompts (): Promise<Prompt[]> {
        return await PromptModel.find().limit(2); 
     }
}
