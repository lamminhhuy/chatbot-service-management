import { validateRequest } from "@/shared/middlewares/validateRequest/validateRequest";
import { Router } from "express";
import { RequestOtpDTOSchema } from "../dtos/RequestOtp.dto";
import { AuthController } from "../controllers/AuthController";
import { AuthService } from "../services/AuthService";
import { EmailService } from "@/shared/services/EmailService";
import { RedisOTPStorage } from "@/shared/services/RedisOTPStorage";
import { UserService } from "@/modules/user/services/UserService";
import { UserRepository } from "@/modules/user/repositories/UserRepository";
import { registerRequestDTO } from "../dtos/RegisterRequest.dto";
import asyncHandler from "@/shared/utils/asyncHandler";
import { RoleService } from "@/modules/user/services/RoleService";
import { RoleRepository } from "@/modules/user/repositories/RoleRepository";

export const authRouter = Router()
const emailService = new EmailService()
const otpStorage = new RedisOTPStorage()
const userRepo = new UserRepository()
const roleRepository = new  RoleRepository()
const roleService = new RoleService(roleRepository)
const userService = new UserService(userRepo,roleService)
const authService = new AuthService(emailService,otpStorage,userService)
const authController = new AuthController(authService)

authRouter.post('/request-otp', validateRequest(RequestOtpDTOSchema),asyncHandler(authController.requestOTP.bind(authController)))

authRouter.post('/verify-otp', validateRequest(registerRequestDTO),asyncHandler(authController.verifyOTP.bind(authController)))