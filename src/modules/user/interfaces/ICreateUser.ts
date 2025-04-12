import { Role } from "@/modules/role/models/RoleModel";

export interface UserCreationDTO {
  email: string;
  username: string;
  phoneNumber: string | null;
  password: string;
  avatarUrl: string | null;
  roles: Role[];
}