Overview

Build a multiplayer real-time web application where users can capture tiles on a shared grid. Any user visiting the site can claim an available tile, and ownership changes should be reflected instantly for all connected users.

The goal is to demonstrate strong frontend polish, backend architecture, and real-time systems thinking.

Core Objective

Create a smooth, responsive shared board experience where multiple users can interact simultaneously without conflicts or stale state.

Functional Requirements
1. Shared Grid Board
Display a grid containing hundreds of tiles (e.g. 20x20 or larger)
Each tile must have one of two states:
Unclaimed
Owned by a user
Owned tiles visually display player ownership (color/name)
2. User Participation
Users can join instantly as guest users
User provides:
username
color/avatar (optional)
3. Tile Claiming
Clicking a tile sends claim request to server
If valid, tile ownership is assigned to that user
If already claimed by another user during same moment, only one succeeds
4. Real-Time Updates
All connected users must see tile ownership changes instantly
Use WebSockets / Socket-based communication
No manual refresh required
5. Multiplayer Safety
Handle multiple simultaneous clicks safely
Prevent race conditions on same tile
Ensure server-authoritative ownership state
Non-Functional Requirements
Performance
Initial board load under 2 seconds
Tile updates feel near-instant (<200ms preferred)
Smooth UI interactions during rapid updates
Reliability
App should remain stable with multiple concurrent users
Reconnect gracefully if socket disconnects
UI / UX
Clean modern interface
Clear tile ownership visuals
Responsive across desktop/mobile
Suggested Technical Requirements
Frontend
React + Vite
Responsive grid UI
State management for live board updates
Backend
Node.js + Express
WebSocket server
Data Layer
PostgreSQL for persistent state
Redis for locks/cache (recommended)
Bonus Features (Optional)
Leaderboard (most tiles owned)
Cooldown between claims
Online player count
Hover effects / animations
Zoom / pan for larger maps
Tile capture sound effects
Success Criteria
Users can join instantly
Users can claim tiles
All players see updates live
Multiple users can interact without breaking state
UI feels polished and responsive