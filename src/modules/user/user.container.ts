import { container } from "tsyringe";
import { UserService } from "./services/UserService";
import { UserSession } from "./models/UserSessionModel";
import { AppDataSource } from "@/database/PostgresDB";
import { UserRepository } from "./repositories/UserRepository";

export function registerUserDependencies() {
  container.register('UserSessionRepository',{useValue: AppDataSource.getRepository(UserSession)})
  container.register('IUserRepository', {useClass: UserRepository})
  container.register(UserService,{useClass: UserService} )
  container.register(UserSession,{useClass: UserSession})
}