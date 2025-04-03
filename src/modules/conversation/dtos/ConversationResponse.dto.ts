
import { z } from "zod";
import { MessageResponseDTOSchema } from "./MessageResponse.dto";

export const ConversationReponseDTOSchema = z.object({
    title: z.string(),
    createdAt: z.date(),
    id: z.number(),
    messages: z.array(MessageResponseDTOSchema),
});