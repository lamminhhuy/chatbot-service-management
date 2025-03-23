import { ChatCompletionMessageParam } from "openai/resources/index";
import { Message } from "../models/MessageModel";
import { SessionMessage } from "../types/SessionMessage";

export interface IMessageAdapter {
  toOpenAi (message: Message | SessionMessage ):ChatCompletionMessageParam,
  toDomain (message: ChatCompletionMessageParam): Omit<Message,'id'|'metadata'>
}