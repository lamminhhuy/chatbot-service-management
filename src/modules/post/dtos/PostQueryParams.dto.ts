import { BaseQueryParamsSchema } from "@/shared/schemas/BaseQueryParamsSchema";
import { z } from "zod";

export const PostQueryParamsDTOSchema = BaseQueryParamsSchema.extend({
    categoryId: z.any().optional(),
    categorySlug: z.any().optional(),
    categoryName: z.any().optional(),
    title: z.any().optional()
})

export type PostQueryParamsDTO = z.infer<typeof PostQueryParamsDTOSchema >;