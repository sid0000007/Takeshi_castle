# Takeshi Castle

Real-time multiplayer shared-grid web app built from the repository docs. The stack follows the documented architecture: React + Vite frontend, Express + Socket.IO backend, PostgreSQL persistence, and Redis for locks/cache.

## Workspace

- `apps/server` - API, Socket.IO server, Redis/gameplay logic, Postgres access
- `apps/web` - React client, shared grid UI, live updates
- `packages/shared` - shared TypeScript contracts used across frontend and backend

## Local Development

1. Start infrastructure:

```bash
docker compose up -d
```

2. Install dependencies:

```bash
npm install
```

3. Copy env files from the examples in `apps/server` and `apps/web`.

4. Run the backend and frontend in separate terminals:

```bash
npm run dev:server
npm run dev:web
```

## Build and Test

```bash
npm run build
npm run test
```

## Environment Files

- `apps/server/.env`
- `apps/web/.env`

Use the `.env.example` files in each app as the starting point.

## Deployment Notes

- Frontend can be deployed as a static Vite build on Vercel, Netlify, or Render Static.
- Backend is designed for a Node web service on Render or a similar host.
- PostgreSQL and Redis are required in every environment because gameplay persistence and locking depend on them.

## Status

Implementation is phase-driven and tracked in [docs/implementation-plan.md](/Users/siddharth/Desktop/takeshi_castle/docs/implementation-plan.md).
# Takeshi_castle
