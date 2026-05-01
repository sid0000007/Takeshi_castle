// Validates auth payloads for registration, login, and guest access.
import { z } from "zod";

export const guestLoginSchema = z.object({
  username: z.string().trim().min(2).max(30),
  color: z
    .string()
    .trim()
    .regex(/^#([0-9a-fA-F]{6})$/)
    .optional()
});

export const registerSchema = z.object({
  email: z.string().trim().email(),
  username: z.string().trim().min(2).max(30),
  password: z.string().min(8).max(100),
  color: z.string().trim().regex(/^#([0-9a-fA-F]{6})$/)
});

export const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(8).max(100)
});
