
import { Session } from "@/shared/entites/Session";
import { ISessionStore } from "@/shared/interfaces/repositories/ISessionStore";
import Redis from "ioredis";
export class RedisSessionStore implements ISessionStore {
  private client;
  constructor(client: Redis) {
    this.client = client;
  }

  async saveSession(sessionId: string, session: Session): Promise<void> {
    try {
      await this.client.set(sessionId, JSON.stringify(session));
    } catch (error) {
      console.error("Error saving session to Redis:", error);
      throw error;
    }
  }

  async getSession(sessionId: string): Promise<Session | null> {
    if (!sessionId) return null;
    const sessionData = await this.client.get(sessionId);

    if (sessionData) {
      const parsedData = JSON.parse(sessionData);
      const session = new Session(sessionId);
      session.messages = parsedData.messages || [];
      return session;
    }

    return null;
  }
}
