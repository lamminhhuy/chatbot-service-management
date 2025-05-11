import { BaseQueryParamsSchema } from "@/shared/schemas/BaseQueryParamsSchema";
import { z } from "zod";

export const PostCategoryQueryParamsDTOSchema = BaseQueryParamsSchema.extend({
    search: z.string().optional(),
    sort: z.string().optional()
});

export type PostCategoryQueryParamsDTO = z.infer<typeof PostCategoryQueryParamsDTOSchema>;

    