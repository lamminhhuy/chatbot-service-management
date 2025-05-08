import { z } from "zod";

export const LoginGoogleDTOSchema = z.object({
    token: z.string().min(1).max(1000)
});

export type LoginGoogleDTO = z.infer<typeof LoginGoogleDTOSchema>;