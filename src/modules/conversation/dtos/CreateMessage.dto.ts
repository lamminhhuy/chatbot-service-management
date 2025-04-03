import { z } from "zod";
import { ChatRole } from "../enums/ChatRole";

export const CreateMessageDTOSchema = z.object({
  content: z.string().nonempty("content is required"), 
  role: z.nativeEnum(ChatRole), 
});

export type CreateMessageDTO = z.infer<typeof CreateMessageDTOSchema>;