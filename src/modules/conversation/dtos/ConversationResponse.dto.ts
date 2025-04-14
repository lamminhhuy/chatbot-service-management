
import { z } from "zod";
import { MessageResponseDTOSchema } from "./MessageResponse.dto";
import _ from "lodash";
import dayjs from "dayjs";
import { Conversation } from "../models/Conversation";

export const  ConversationReponseDTOSchema = z.object({
        title: z.string(),
        createdAt: z.date(),
        id: z.number(),
        messages: z.array(MessageResponseDTOSchema),
})

export const CreateConversationReponseDTOSchema = ConversationReponseDTOSchema.transform((conversation) => {
    return {
        ...conversation,
        assistantResponse: conversation.messages[1],
    };
}
);

export const ConversationsReponseDTOSchema  =  z.array(ConversationReponseDTOSchema).transform((conversations) => {
    return _.groupBy(conversations, (c) => dayjs(c.createdAt).format('YYYY-MM-DD'));
  });
