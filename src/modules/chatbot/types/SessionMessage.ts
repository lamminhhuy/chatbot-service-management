import { ChatRole } from "@/modules/conversation/enums/ChatRole";

export type SessionMessage = {
    id?: number;
    content: string;
    role: ChatRole;
    metadata?: { url: string; type: string };
  };