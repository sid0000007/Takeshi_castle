# Updates Plan

## Phase 1 - Auth + Admin Foundation
- Replace guest-only auth with persistent email/password auth.
- Extend users with `email`, `password_hash`, `role`, `is_guest`, and `auth_version`.
- Add register, login, and session endpoints.
- Seed or upsert a development admin user from environment variables.

## Phase 2 - Token Revocation + Game Reset
- Move JWT validation to a server-authoritative flow that checks the database on every authenticated request and socket connection.
- Add an admin-only reset endpoint that:
  - clears all tile ownership
  - clears claim history, cooldowns, leaderboard stats
  - invalidates all non-admin auth by bumping `auth_version`
- Broadcast a reset event so connected clients return to a clean state immediately.

## Phase 3 - Richer Realtime Game State
- Extend game state responses with a live player overview:
  - tiles owned per player
  - approximate position / hotspot based on claimed tile coordinates
  - online status where available
- Keep tile ownership explicit in all tile payloads so UI can clearly show who owns each tile.

## Phase 4 - Simpler Auth UX
- Remove the marketing-style landing experience.
- Replace it with a compact auth screen with login/register modes.
- Keep color selection during registration so claimed tiles still have player identity.

## Phase 5 - Stakes-Like Game HUD + Ownership Clarity
- Add a top live overview bar that opens a dialog with player status.
- Make claimed tiles visually clearer with stronger ownership indicators.
- Improve top-level board controls and game status presentation.

## Phase 6 - Big Map Navigation + Motion
- Add zoom controls and a scroll/drag-friendly board viewport.
- Add framer-motion micro-interactions for tiles, dialogs, counters, and HUD transitions.
- Keep interactions clean and fast rather than overly decorative.

## Phase 7 - Validation
- Build the frontend and backend.
- Run existing tests and add targeted coverage where practical.
- Document any remaining follow-up items if something is intentionally deferred.
