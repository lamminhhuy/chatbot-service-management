import { Repository } from "typeorm";
import { Message } from "../models/Message";
import { CreateMessageDTO } from "../dtos/CreateMessage.dto";

export interface IMessageRepository extends Repository<Message> {
    createMessage(conversationId: number, message: CreateMessageDTO): Promise<Message>;
}