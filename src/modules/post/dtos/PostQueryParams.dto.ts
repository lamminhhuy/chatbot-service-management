import { BaseQueryParamsSchema } from "@/shared/schemas/BaseQueryParamsSchema";
import { z } from "zod";

export const PostQueryParamsDTOSchema = BaseQueryParamsSchema.extend({
})

export type PostQueryParamsDTO = z.infer<typeof PostQueryParamsDTOSchema > & {categorySlug: string, categoryId: number};