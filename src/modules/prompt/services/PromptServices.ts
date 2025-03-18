import { IPromptRepository } from "@/shared/interfaces/repositories/IPromptRepository";

export class PromptService  {
    constructor(private promptRepo: IPromptRepository){}
    async handleFetchPrompt (){
     return await this.promptRepo.getPrompts()   
    }
}