import { z } from "zod";

export const CreateMessageDTOSchema = z.object({
  content: z.string().nonempty("content is required")
});

export type CreateMessageDTO = z.infer<typeof CreateMessageDTOSchema>;