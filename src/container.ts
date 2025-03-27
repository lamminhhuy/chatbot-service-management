import { registerAuthDependencies } from "./modules/auth/auth.container";
import { registerRoleDependencies } from "./modules/role/role.container";
import { registerUserDependencies } from "./modules/user/user.container";

export function setUpContainers (){
  registerRoleDependencies()
  registerUserDependencies()
  registerAuthDependencies()
}

