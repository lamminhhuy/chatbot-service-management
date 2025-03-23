import { Message } from "@/modules/chatbot/models/MessageModel";
import { SessionMessage } from "@/modules/chatbot/types/SessionMessage";
export class Session {
  id: string;
  messages:SessionMessage[];

  constructor(id?: string) {
    this.id = id || crypto.randomUUID();
    this.messages = [];
  }

  addMessage(message:SessionMessage) {
    this.messages.push(message);
  }
}
