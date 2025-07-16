import { Repository } from "typeorm";
import { UserSession } from "../models/UserSessionModel";
import { AppDataSource } from "@/shared/infrastructure/database/PostgresDB";
import { IUserSessionRepository } from "../interfaces/IUserSessionRepository";
export class UserSessionRepository extends Repository<UserSession> implements IUserSessionRepository {
    constructor() {
        super(UserSession, AppDataSource.manager);    
    }
    async revokeUserTokens(userId: number) {
        return this.update({ user: { id: userId } }, { isRevoked: true });
    }
}