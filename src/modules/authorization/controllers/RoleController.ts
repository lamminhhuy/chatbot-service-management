import { RoleService } from "@/modules/user/services/RoleService";
import { CustomRequest } from "@/shared/interfaces/CustomRequest";
import { inject } from "tsyringe";

class RoleController {
    constructor(
        @inject(RoleService) private readonly roleService: RoleService,
    ) {}

    async addPermission(req: CustomRequest<{},{},{}>,): Promise<void> {
    
    }
}