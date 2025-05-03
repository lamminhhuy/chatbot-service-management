import { validateRequest } from "@/shared/middlewares/validateRequest/validateRequest";
import { RequestOtpDTOSchema } from "../dtos/RequestOtp.dto";
import { AuthController } from "../controllers/AuthController";
import { RegisterRequestDTOSchema } from "../dtos/RegisterRequest.dto";
import { container } from "tsyringe";
import { LoginRequestDTOSchema } from "../dtos/LoginRequest.dto";
import { verifyRefreshToken } from "../middlewares/requireRefreshToken.middleware";
import { ModuleConfig } from "../interfaces/ModuleConfig";
import { RequestResetPasswordDTOSchema, VerifyResetPasswordDTOSchema } from "../dtos/ResetPassword.dto";

const authController = container.resolve(AuthController)

export const authModule: ModuleConfig = {
    prefix: "/auth",
    moduleName: "auth",
    routes: [
        {
            method: "POST",
            path: "/request-otp",
            isPublic: true,
            handler: { controller: 'auth',
                action:  authController.requestOTP.bind(authController)},
            middlewares: [validateRequest(RequestOtpDTOSchema)]
        },
        {
            method: "POST",
            path: "/login",
            isPublic: true,
            handler: { controller: 'auth',
                action:  authController.login.bind(authController)},
            middlewares: [validateRequest(LoginRequestDTOSchema)]
        },
        {
            method: "POST",
            isPublic: true,
            path: "/verify-otp",
            handler: { controller: 'auth',
                action:  authController.verifyOTP.bind(authController)},   
            middlewares: [validateRequest(RegisterRequestDTOSchema)]
        },
        {
            method: "POST",
            isPublic: true,
            path: "/refresh",
            handler: { controller: 'auth',
                action:  authController.handleRefreshToken.bind(authController)},
            middlewares: [verifyRefreshToken]
        },
        {
            method: "POST",
            isPublic: true,
            path: "/reset-password",
            handler: { controller: 'auth',
                action:  authController.resetPassword.bind(authController)},
            middlewares: [validateRequest(RequestResetPasswordDTOSchema)]
        },
        {
            method: "POST",
            path: "/reset-password/verify",
            handler: { controller: 'auth',
                action:  authController.verifyResetPasswordOtp.bind(authController)},
            middlewares: [validateRequest(VerifyResetPasswordDTOSchema)]
        },
        {
            method: "POST",
            path: "/logout",
            handler: { controller: 'auth',
                action:  authController.logout.bind(authController)},
            middlewares: [verifyRefreshToken]
        }
    ]
}