import { Author } from "./Author";

export class Message {
  author: Author;
  content: string;
  metadata;
  constructor(author: Author, content: string, metadata?: Record<string, any>) {
    this.author = author;
    this.content = content;
    this.metadata = metadata;
  }
}
