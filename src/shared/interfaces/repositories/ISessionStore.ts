import { Session } from "../../entites/Session";

export interface ISessionStore {
  saveSession(sessionId: string, session: Session): Promise<void>;
  getSession(sessionId: string): Promise<Session | null>;
}
