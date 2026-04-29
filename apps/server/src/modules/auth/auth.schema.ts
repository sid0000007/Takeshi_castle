import { z } from "zod";

export const guestLoginSchema = z.object({
  username: z.string().trim().min(2).max(30),
  color: z
    .string()
    .trim()
    .regex(/^#([0-9a-fA-F]{6})$/)
    .optional()
});
