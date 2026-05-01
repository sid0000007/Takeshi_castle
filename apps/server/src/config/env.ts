// Loads and validates server environment variables before the app starts.
import { config } from "dotenv";
import { z } from "zod";

config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().default(4000),
  CLIENT_URL: z.string().url().default("http://localhost:5173"),
  DATABASE_URL: z.string().min(1),
  REDIS_URL: z.string().min(1),
  JWT_SECRET: z.string().min(8),
  ADMIN_EMAIL: z.string().email().default("admin@takeshi.local"),
  ADMIN_PASSWORD: z.string().min(8).default("admin12345"),
  ADMIN_USERNAME: z.string().min(2).max(30).default("Admin"),
  ADMIN_COLOR: z.string().regex(/^#([0-9a-fA-F]{6})$/).default("#f43f5e"),
  ACTIVE_SESSION_NAME: z.string().default("Season 1"),
  GRID_ROWS: z.coerce.number().default(20),
  GRID_COLS: z.coerce.number().default(20),
  CLAIM_COOLDOWN_MS: z.coerce.number().default(1000),
  TILE_LOCK_TTL_MS: z.coerce.number().default(2000)
});

export const env = envSchema.parse(process.env);
