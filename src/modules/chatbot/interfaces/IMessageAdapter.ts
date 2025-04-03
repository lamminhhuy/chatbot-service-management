import { ChatCompletionMessageParam } from "openai/resources/index";
import { SessionMessage } from "../types/SessionMessage";
import { Message } from "@/modules/conversation/models/Message";

export interface IMessageAdapter {
  toOpenAi (message: Message | SessionMessage ):ChatCompletionMessageParam,
  toDomain (message: ChatCompletionMessageParam): Omit<Message,'id'|'metadata'>
}