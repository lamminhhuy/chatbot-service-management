import { z } from "zod";
import { chatRequestSchema } from "../validators/ChatValidator";

export type IChatRequest = z.infer<typeof chatRequestSchema>;

export interface IChatResponse {
  message: string;
  data: Record<string, unknown>;
}