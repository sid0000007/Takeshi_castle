┌──────────────────────────────────────────────┐
│                Frontend Client              │
│     Vite + React + Tailwind + Socket.IO     │
│                                              │
│  • Render interactive tile grid             │
│  • Handle clicks / animations               │
│  • Listen for live tile updates             │
│  • Show leaderboard / online players        │
└──────────────────────────────────────────────┘
                    │
         HTTPS REST │   WebSocket (real-time)
                    │
                    ▼
┌──────────────────────────────────────────────┐
│              Backend API Server             │
│      Node.js + Express + Socket.IO          │
│                                              │
│  REST APIs                                  │
│  • Guest login                              │
│  • Initial game state                       │
│  • Leaderboard                              │
│                                              │
│  WebSocket Events                           │
│  • join_game                                │
│  • claim_tile                               │
│  • tile_updated                             │
│  • online_users                             │
└──────────────────────────────────────────────┘
                    │
                    │
      ┌─────────────┴─────────────┐
      │                           │
      ▼                           ▼

┌──────────────────────┐   ┌──────────────────────────┐
│        Redis         │   │       PostgreSQL         │
│                      │   │                          │
│ • Live grid cache    │   │ • Users                 │
│ • Tile locks         │   │ • Tiles current state   │
│ • Cooldowns          │   │ • Claim history         │
│ • Leaderboard cache  │   │ • Sessions / stats      │
│ • Pub/Sub scaling    │   │                          │
└──────────────────────┘   └──────────────────────────┘





Runtime Claim Flow

User clicks tile
      ↓
Frontend emits claim_tile
      ↓
Backend receives request
      ↓
Redis lock on tile
      ↓
If success:
   update Redis state
   update PostgreSQL
   broadcast tile_updated
Else:
   send claim_failed


Deployment Diagram

Frontend (Vercel / Netlify / Render Static)
                ↓
        Backend (Render Web Service)
                ↓
        Redis + PostgreSQL























# Real-Time Flow Explanation

The application uses WebSockets to keep all connected players synchronized in real time.

Instead of refreshing the page or polling the server repeatedly, clients maintain an open socket connection with the backend. This allows the server to instantly push updates whenever a tile changes ownership.

1. User Joins the Game
User opens app
     ↓
Frontend loads initial grid state via REST API
     ↓
Frontend connects to WebSocket server
     ↓
User joins active game room
What Happens
Initial board state fetched once using HTTP
WebSocket connection established using Socket.IO
User starts receiving live events

2. User Claims a Tile
User clicks tile (12,8)
     ↓
Frontend emits socket event:
claim_tile
Payload Example
{
 "tileId": "12_8",
 "userId": "u123"
}

3. Backend Processes Claim
Backend receives event
     ↓
Validate user + tile
     ↓
Acquire Redis lock for tile
Why Locking Is Needed
If multiple users click the same tile simultaneously:
only one request should win
prevents duplicate ownership updates
avoids race conditions
Using Redis atomic lock:
lock:tile:12_8

4. If Claim Succeeds
Update tile owner in Redis cache
     ↓
Persist latest state to PostgreSQL
     ↓
Broadcast update to all connected users
Broadcast Event
tile_updated
Payload
{
 "tileId": "12_8",
 "owner": "Sid",
 "color": "#22c55e"
}

5. All Players See Instant Update
Server emits tile_updated
     ↓
Every connected client receives event
     ↓
Only changed tile re-renders
     ↓
Board updates instantly
This creates the live multiplayer experience.

6. If Claim Fails
If another player already captured the tile first:
claim_failed
Payload
{
 "reason": "Tile already claimed"
}
Frontend may show toast / shake animation.

Full Claim Lifecycle
Click tile
  ↓
Emit claim_tile
  ↓
Backend lock tile
  ↓
Winner chosen
  ↓
Update cache + DB
  ↓
Broadcast tile_updated
  ↓
Everyone sees change

Why WebSockets Instead of Polling
Polling (bad for this use case)
Every 2 sec ask:
"Has grid changed?"
Problems:
delayed updates
unnecessary requests
server load increases fast
WebSockets (ideal)
Server pushes only real updates instantly
Benefits:
low latency
fewer requests
smoother gameplay

Performance Optimizations Used
Only changed tile updates on frontend
Redis handles fast transient state
Socket sends delta events, not full board
Initial board loaded once


