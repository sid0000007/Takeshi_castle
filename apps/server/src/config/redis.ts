// Creates the Redis client used for locks, cooldowns, and cached game state.
import Redis from "ioredis";

import { env } from "./env.js";

export const redis = new Redis(env.REDIS_URL, {
  maxRetriesPerRequest: 1,
  lazyConnect: true
});
