grid-war-backend/
│── package.json
│── tsconfig.json
│── .env
│── .env.example
│── .gitignore
│── README.md
│── docker-compose.yml
│── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
│
│── src/
│   │
│   ├── index.ts                # Main entrypoint
│   ├── app.ts                  # Express app init
│   ├── server.ts               # HTTP server + websocket attach
│   │
│   ├── config/
│   │   ├── env.ts              # zod env validation
│   │   ├── db.ts               # Prisma client
│   │   ├── redis.ts            # Redis client
│   │   └── socket.ts           # socket config
│   │
│   ├── modules/
│   │   │
│   │   ├── auth/
│   │   │   ├── auth.routes.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   └── auth.schema.ts
│   │   │
│   │   ├── users/
│   │   │   ├── users.routes.ts
│   │   │   ├── users.controller.ts
│   │   │   └── users.service.ts
│   │   │
│   │   ├── game/
│   │   │   ├── game.routes.ts
│   │   │   ├── game.controller.ts
│   │   │   ├── game.service.ts
│   │   │   ├── game.repository.ts
│   │   │   └── game.schema.ts
│   │   │
│   │   ├── tiles/
│   │   │   ├── tiles.routes.ts
│   │   │   ├── tiles.controller.ts
│   │   │   ├── tiles.service.ts
│   │   │   ├── tiles.repository.ts
│   │   │   └── tiles.schema.ts
│   │   │
│   │   ├── leaderboard/
│   │   │   ├── leaderboard.routes.ts
│   │   │   ├── leaderboard.controller.ts
│   │   │   └── leaderboard.service.ts
│   │   │
│   │   └── health/
│   │       └── health.routes.ts
│   │
│   ├── sockets/
│   │   ├── index.ts            # socket bootstrap
│   │   ├── handlers/
│   │   │   ├── connection.ts
│   │   │   ├── claimTile.ts
│   │   │   ├── disconnect.ts
│   │   │   └── heartbeat.ts
│   │   │
│   │   ├── rooms/
│   │   │   └── game.room.ts
│   │   │
│   │   └── events.ts
│   │
│   ├── middleware/
│   │   ├── auth.ts
│   │   ├── error.ts
│   │   ├── rateLimit.ts
│   │   └── logger.ts
│   │
│   ├── lib/
│   │   ├── logger.ts
│   │   ├── jwt.ts
│   │   ├── response.ts
│   │   ├── lock.ts            # redis lock helpers
│   │   └── validators.ts
│   │
│   ├── jobs/
│   │   ├── cleanup.job.ts
│   │   ├── stats.job.ts
│   │   └── tileSync.job.ts
│   │
│   ├── types/
│   │   ├── express.d.ts
│   │   └── socket.d.ts
│   │
│   └── constants/
│       ├── events.ts
│       └── game.ts
│
└── tests/
    ├── unit/
    └── integration/



Main Files
src/index.ts
import { startServer } from "./server";

startServer();

src/server.ts
Create HTTP server
Attach Socket.IO
Register routes
Register socket handlers
Listen on port

REST APIs (MVP)
Auth
POST /api/auth/guest-login
Creates guest user:
{
 "username": "Sid",
 "color": "#22c55e"
}
Returns JWT.

Game State
GET /api/game/state
Returns:
{
 "rows": 20,
 "cols": 20,
 "tiles": [...]
}

Claim via HTTP (backup)
POST /api/tiles/:tileId/claim
(Mainly websocket used)

Leaderboard
GET /api/leaderboard

Health
GET /health

WebSocket Events
Client → Server
join_game
claim_tile
ping
Server → Client
game_state
tile_updated
claim_failed
leaderboard_updated
User_count
pong

Claim Tile Flow
socket claim_tile(tileId)
   ↓
validate user
   ↓
redis lock tile:{id}
   ↓
if fail => claim_failed
   ↓
update postgres
update redis cache
   ↓
broadcast tile_updated
   ↓
release lock

