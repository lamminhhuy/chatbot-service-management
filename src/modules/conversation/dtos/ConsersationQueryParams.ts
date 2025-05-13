import { BaseQueryParamsSchema } from "@/shared/schemas/BaseQueryParamsSchema";
import { z } from "zod";

export const ConversationQueryParamsDTOSchema = BaseQueryParamsSchema.extend({
  userId: z.any().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional()
});

export type ConversationQueryParamsDTO = z.infer<typeof ConversationQueryParamsDTOSchema>;
