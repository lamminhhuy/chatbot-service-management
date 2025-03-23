import { registerRequestDTO } from "@/modules/auth/dtos/RegisterRequest.dto";
import { validateRequest } from "@/shared/middlewares/validateRequest/validateRequest";
import { Router } from "express";

export const userRouter = Router()

userRouter.post('/register', validateRequest(registerRequestDTO))