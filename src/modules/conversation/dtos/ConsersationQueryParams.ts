import { z } from "zod";

export const ConversationQueryParamsDTOSchema = z.object({
  limit: z.string()
    .transform((val) => parseInt(val, 10))
    .default('10')
    .pipe(z.number()),
  
  offset: z.string()
    .transform((val) => parseInt(val, 10))
    .default('0')
    .pipe(z.number()),

  search: z.string().optional(),
  sort: z.string().optional(),
  userId: z.coerce.number().optional(), 
  userName: z.string().optional()
});

export type ConversationQueryParamsDTO = z.infer<typeof ConversationQueryParamsDTOSchema>;
