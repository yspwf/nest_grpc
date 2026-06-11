import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  DATABASE_TYPE: z.string().optional(),
  DATABASE_HOST: z.string().optional(),
  DATABASE_PORT: z
    .string()
    .transform((val) => parseInt(val, 10))
    .default(3306),
  DATABASE_URL: z.string().optional(),
  DATABASE_USERNAME: z.string().regex(/^[a-zA-Z0-9_]+$/).optional(),
  DATABASE_PASSWORD: z.string().optional(),
});