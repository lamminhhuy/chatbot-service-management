import { z } from "zod";

export const LoginGoogleDTOSchema = z.object({
    token: z.string().min(1)
});

export type LoginGoogleDTO = z.infer<typeof LoginGoogleDTOSchema>;