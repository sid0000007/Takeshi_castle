Use Redis for:
Live grid state cache
Tile claim locking (prevent two users claiming same tile simultaneously)
Rate limiting / cooldowns
Leaderboard counters
Pub/Sub if scaling to multiple backend instances later

Why Redis Matters Here
Without Redis:
Every click
↓
Read tile from Postgres
↓
Update tile
↓
Broadcast
With many users:
DB connection pool pressure
slower response
race conditions
With Redis:
Click
↓
Redis lock
↓
Redis update
↓
Broadcast instantly
↓
Async persist to Postgres
Much better.

Best Setup for Your Assignment
Use:
Backend on Render
PostgreSQL on Render / Neon / Supabase
Redis via:
Upstash (easy + serverless)
Render Redis
Redis Cloud
Easiest = Upstash
Because:
quick setup
generous free tier
external URL
works great with Render

Backend Folder Structure Add Redis
src/
├── config/
│    └── redis.ts
├── lib/
│    └── lock.ts
├── services/
│    └── tileCache.service.ts

Install
npm i ioredis
Use ioredis.

src/config/redis.ts
import Redis from "ioredis";

export const redis = new Redis(process.env.REDIS_URL!);

ENV
REDIS_URL=rediss://default:password@host:port

Redis Keys Design
Grid State
game:grid
Hash:
field: 14_7
value: user123

Tile Lock
lock:tile:14_7
TTL = 2 sec

Cooldown
cooldown:user:u123
TTL = 1 sec

Leaderboard
leaderboard
Sorted set:
ZINCRBY leaderboard 1 user123

Claim Tile Flow (Best)
1. SETNX lock:tile:14_7
2. If fail => reject
3. HSET game:grid 14_7 user123
4. ZINCRBY leaderboard
5. emit tile_updated
6. queue postgres update
7. DEL lock

Huge Benefit: Protect DB Pool
Instead of 500 users hammering Postgres:
Redis handles gameplay
Postgres stores truth/history
This is exactly what you want.

If You Skip Redis (Pure MVP)
You can do:
SELECT ... FOR UPDATE
inside Postgres transaction.
But:
slower
more pool usage
harder under load
Redis is cleaner.

