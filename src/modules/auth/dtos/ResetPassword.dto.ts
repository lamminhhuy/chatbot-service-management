import { z } from "zod";

export const RequestResetPasswordDTOSchema = z.object({
    email: z.string().email(),
}).strict();

export type RequestResetPasswordDTO = z.infer<typeof RequestResetPasswordDTOSchema>

export const VerifyResetPasswordDTOSchema = z.object({
    email: z.string().email(),
    otp: z.string(),
    newPassword: z.string().min(8)
}).strict();
export type VerifyResetPasswordDTO = z.infer<typeof VerifyResetPasswordDTOSchema>
