import { z } from "zod";

export const CreateRoleDTO = z.object({
  code: z.string(),
  name: z.string(),
  description: z.string()
});

export type CreateRoleDTO = z.infer<typeof CreateRoleDTO>;