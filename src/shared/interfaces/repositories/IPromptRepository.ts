import { Prompt } from "../../entites/Prompt";

interface IPromptRepository {
    getPrompts(): Promise<Prompt[]>;
}

export { IPromptRepository };