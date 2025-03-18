
import { Session } from "@/shared/entites/Session";
import { ISessionStore } from "@/shared/interfaces/repositories/ISessionStore";
import { RedisClientType } from "redis";
export class RedisSessionStore implements ISessionStore {
  private client;
  constructor(client: RedisClientType) {
    this.client = client;
  }

  async saveSession(sessionId: string, session: Session): Promise<void> {
    await this.client.set(sessionId, JSON.stringify(session));
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
