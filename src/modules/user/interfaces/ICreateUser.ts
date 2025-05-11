import { Role } from "@/modules/authorization/models/RoleModel";
import { ResourceRegister } from "../enums/ResourceRegister";


export interface UserCreationDTO {
  email: string;
  username: string;
  phoneNumber: string | null;
  password: string;
  avatarUrl: string | null;
  roles: Role[];
  resourceRegister: ResourceRegister;
}