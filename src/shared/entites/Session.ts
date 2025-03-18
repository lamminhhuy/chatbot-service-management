import { Author } from "./Author";
import { Message } from "./Message";
export class Session {
  id: string;
  messages: Message[];
  private static readonly CONTEXT_MESSAGE_COUNT = 3;

  constructor(id?: string) {
    this.id = id || crypto.randomUUID();
    this.messages = [];
  }

  addMessage(message: Message) {
    this.messages.push(message);
  }
}
