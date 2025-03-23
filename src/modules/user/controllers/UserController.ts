
import { UserService } from "../services/UserService";

export class UserController {
    private userService: UserService;
    constructor(userService: UserService) {
        this.userService = userService;
    }
    
}