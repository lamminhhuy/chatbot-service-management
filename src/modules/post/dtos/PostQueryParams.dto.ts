import { z } from "zod";

export const PostQueryParamsDTOSchema = z.object({
    limit: z.string()
       .transform((val) => parseInt(val, 10))
       .default('10')
       .pipe(z.number()),
     
     offset: z.string()
       .transform((val) => parseInt(val, 10))
       .default('0')
       .pipe(z.number()),
    search: z.string().optional(),
    categoryId: z.string().optional(),
    sort: z.enum(['title', 'createdAt', 'updatedAt']).optional(),
    order: z.enum(['ASC', 'DESC']).optional(),
});

export type PostQueryParamsDTO = z.infer<typeof PostQueryParamsDTOSchema>;