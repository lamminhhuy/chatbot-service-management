import { validateRequest } from "@/shared/middlewares/validateRequest/validateRequest";
import { Router } from "express";
import { RequestOtpDTOSchema } from "../dtos/RequestOtp.dto";
import { AuthController } from "../controllers/AuthController";
import { RegisterRequestDTOSchema } from "../dtos/RegisterRequest.dto";
import asyncHandler from "@/shared/utils/asyncHandler";
import { container } from "tsyringe";
import { LoginRequestDTOSchema } from "../dtos/LoginRequest.dto";

export const authRouter = Router()

const authController = container.resolve(AuthController)

authRouter.post('/request-otp', validateRequest(RequestOtpDTOSchema),asyncHandler(authController.requestOTP.bind(authController)))

authRouter.post('/login', validateRequest(LoginRequestDTOSchema),asyncHandler(authController.login.bind(authController)))

authRouter.post('/verify-otp', validateRequest(RegisterRequestDTOSchema),asyncHandler(authController.verifyOTP.bind(authController)))

authRouter.post('/refresh',asyncHandler(authController.handleRefreshToken.bind(authController)))