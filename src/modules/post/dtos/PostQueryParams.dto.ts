import { BaseQueryParamsSchema } from "@/shared/schemas/BaseQueryParamsSchema";
import { z } from "zod";

export const PostQueryParamsDTOSchema = BaseQueryParamsSchema.extend({
    categorySlug: z.string().optional(),
    categoryId: z.string().optional()
})

export type PostQueryParamsDTO = z.infer<typeof PostQueryParamsDTOSchema>;