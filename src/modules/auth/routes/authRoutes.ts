import { validateRequest } from "@/shared/middlewares/validateRequest/validateRequest";
import { RequestOtpDTOSchema } from "../dtos/RequestOtp.dto";
import { AuthController } from "../controllers/AuthController";
import { RegisterRequestDTOSchema } from "../dtos/RegisterRequest.dto";
import { container } from "tsyringe";
import { LoginRequestDTOSchema } from "../dtos/LoginRequest.dto";
import { verifyRefreshToken } from "../middlewares/requireRefreshToken.middleware";
import { ModuleConfig } from "../interfaces/ModuleConfig";

const authController = container.resolve(AuthController)

export const authModule: ModuleConfig = {
    prefix: "/auth",
    routes: [
        {
            method: "post",
            path: "/request-otp",
            isPublic: true,
            handler: authController.requestOTP.bind(authController),
            middlewares: [validateRequest(RequestOtpDTOSchema)]
        },
        {
            method: "post",
            path: "/login",
            isPublic: true,
            handler: authController.login.bind(authController),
            middlewares: [validateRequest(LoginRequestDTOSchema)]
        },
        {
            method: "post",
            isPublic: true,
            path: "/verify-otp",
            handler: authController.verifyOTP.bind(authController),   
            middlewares: [validateRequest(RegisterRequestDTOSchema)]
        },
        {
            method: "post",
            isPublic: true,
            path: "/refresh",
            handler: authController.handleRefreshToken.bind(authController),
            middlewares: [verifyRefreshToken]
        }
    ]
}