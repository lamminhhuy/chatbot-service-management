import { container } from "tsyringe";
import { UserService } from "./services/UserService";
import { UserSession } from "./models/UserSessionModel";
import { AppDataSource } from "@/database/PostgresDB";
import { UserRepository } from "./repositories/UserRepository";
import { UserSessionRepository } from "./repositories/UserSessionRepository";

export function registerUserDependencies() {
  container.register('IUserSessionRepository',{useClass: UserSessionRepository})
  container.register('IUserRepository', {useClass: UserRepository})
  container.register(UserService,{useClass: UserService} )
  container.register(UserSession,{useClass: UserSession})
}