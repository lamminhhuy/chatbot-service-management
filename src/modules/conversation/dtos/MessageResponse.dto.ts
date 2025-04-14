import { UserResponseDTOSchema } from "@/modules/user/dtos/UserResponse.dto";
import { Message } from "@/shared/entites/Message";
import { z } from "zod";


export const MessageResponseDTOSchema = z.object({
    id: z.number(),
    content: z.string(),
    sender: UserResponseDTOSchema.omit({userSubscription: true}),
    role: z.enum(["user", "assistant"]),
    createdAt: z.date()
});


export const CreateMessageResponseDTOSchema = z.array(MessageResponseDTOSchema).transform((messages) => {
    return {
      message:messages[0],
      assistantResponse:{message:messages[1]},
    };
})