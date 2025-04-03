import { z } from "zod";
import { CreateMessageDTOSchema } from "./CreateMessage.dto";

export const CreateConversationDTOSchema = z.object({
    initialMessage: CreateMessageDTOSchema
});

export type CreateConversationDTO = z.infer<typeof CreateConversationDTOSchema>;