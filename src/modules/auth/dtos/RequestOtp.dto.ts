import { z } from "zod";

export const RequestOtpDTOSchema = z.object({
    email: z.string().email("invalid email").nonempty("email is required")
}).strict();

export type RequestOtpDTO = z.infer<typeof RequestOtpDTOSchema>;