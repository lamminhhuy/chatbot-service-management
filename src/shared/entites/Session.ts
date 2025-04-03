import { SessionMessage } from "@/modules/chatbot/types/SessionMessage";
import { randomUUID } from "node:crypto";
export class Session {
  id: string;
  messages:SessionMessage[];

  constructor(id?: string) {
    this.id = id || randomUUID();
    this.messages = [];
  }

  addMessage(message:SessionMessage) {
    this.messages.push(message);
  }
}
