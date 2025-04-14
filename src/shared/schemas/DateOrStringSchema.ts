import { z } from 'zod';

export const DateOrStringSchema = z.union([
  z.string().transform((val) => new Date(val)),
  z.instanceof(Date),
]);

export const NullableDateOrStringSchema = z.union([
  z.string().nullable().transform((val) => (val ? new Date(val) : null)),
  z.instanceof(Date).nullable(),
]);