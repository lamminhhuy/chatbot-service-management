import { Request, Response } from "express";
import { RegisterRequest } from "../dtos/UserDTOs";
import { UserService } from "../services/UserService";

export class UserController {
    private userService: UserService;
    constructor(userService: UserService) {
        this.userService = userService;
    }
    
  public register (req: Request<{},{},RegisterRequest>, res: Response) {
    const { email, password } = req.body;
    this.userService.register(email, password);
    res.status(201).json({ message: "User created successfully" });
  }
}