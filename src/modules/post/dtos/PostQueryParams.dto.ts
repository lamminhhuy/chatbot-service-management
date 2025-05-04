import { z } from "zod";

export const PostQueryParamsDTOSchema = z.object({
    offset: z.number().default(0),
    limit: z.number().default(10),
    search: z.string().optional(),
    categoryId: z.string().optional(),
    sort: z.enum(['title', 'createdAt', 'updatedAt']).optional(),
    order: z.enum(['ASC', 'DESC']).optional(),
});

export type PostQueryParamsDTO = z.infer<typeof PostQueryParamsDTOSchema>;