import { z } from "zod";

export const CreateRoleDTOSchema = z.object({
  name: z.string(),
  description: z.string()
});

export type CreateRoleDTO = z.infer<typeof CreateRoleDTOSchema>;