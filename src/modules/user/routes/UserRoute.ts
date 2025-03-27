import {  RegisterRequestDTOSchema } from "@/modules/auth/dtos/RegisterRequest.dto";
import { validateRequest } from "@/shared/middlewares/validateRequest/validateRequest";
import { Request, Router } from "express";
import { container } from "tsyringe";
import { UserController } from "../controllers/UserController";
import asyncHandler from "@/shared/utils/asyncHandler";

export const userRouter = Router()

const userController = container.resolve(UserController)

userRouter.get('/profile/:id',asyncHandler(userController.getProfile.bind(userController)))