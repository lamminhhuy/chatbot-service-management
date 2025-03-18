import { z } from "zod";
import { registerRequestDTO } from "../validators/registerValidator";

export type RegisterRequest = z.infer<typeof registerRequestDTO>;
