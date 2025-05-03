import { z } from "zod";

export const PostQueryParamsDTOSchema = z.object({
    offset: z.number().default(0),
    limit: z.number().default(10),
    search: z.string().optional(),
    category: z.string().optional(),
    sort: z.string().optional(),
    order: z.string().optional(),
});

export type PostQueryParamsDTO = z.infer<typeof PostQueryParamsDTOSchema>;