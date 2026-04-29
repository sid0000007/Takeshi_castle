// Implements a simple Redis-based distributed lock for tile claims.
import { randomUUID } from "node:crypto";

import { redis } from "../config/redis.js";

export async function acquireLock(key: string, ttlMs: number) {
  const token = randomUUID();
  const result = await redis.set(key, token, "PX", ttlMs, "NX");

  if (result !== "OK") {
    return null;
  }

  return {
    token,
    async release() {
      const currentToken = await redis.get(key);
      if (currentToken === token) {
        await redis.del(key);
      }
    }
  };
}
