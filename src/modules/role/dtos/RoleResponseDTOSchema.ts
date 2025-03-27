import { z } from "zod";

export const RoleResonseDTOSchema = z.object({
  id: z.number(),
  name: z.string(),
  code: z.string(),
  description: z.string(),
});