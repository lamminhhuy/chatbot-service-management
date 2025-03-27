import { Repository } from "typeorm";
import { UserSession } from "../models/UserSessionModel";

export interface IUserSessionRepository extends Repository<UserSession> {
    
}