import { Message } from "../models/MessageModel";

export type SessionMessage = Omit<Message, 'id' | 'metadata'>;