import { User } from "@/modules/user/models/UserModel";
import { Request } from "express";

export interface AuthenticatedRequest<T = any, U = any, V = any> extends Request<T, U, V> {
  user: User; 
}