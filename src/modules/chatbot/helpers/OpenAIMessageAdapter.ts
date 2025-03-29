import { ChatCompletionMessageParam, ChatCompletionRole, ChatCompletionUserMessageParam } from "openai/resources/index";
import { Message } from "../models/MessageModel";
import { SessionMessage } from "../types/SessionMessage";
import { IMessageAdapter } from "../interfaces/IMessageAdapter";



export class OpenAIMessageAdapter implements IMessageAdapter {
   public toOpenAi (message: Message | SessionMessage ):ChatCompletionMessageParam {
    return {
        role: message.role as any,
        content: message.content
       }
   }

   public toDomain (message: ChatCompletionMessageParam): Omit<Message,'id'|'metadata'>{
    return {
        role: message.role as any,
        content: typeof message.content === 'string' ? message.content : '',
    }
   }
}