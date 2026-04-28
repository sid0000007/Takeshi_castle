grid-war-frontend/
│── package.json
│── tsconfig.json
│── vite.config.ts
│── index.html
│── .env
│── .env.example
│── .gitignore
│── README.md
│
│── public/
│   ├── favicon.ico
│   └── logo.svg
│
│── src/
│   │
│   ├── main.tsx                 # ReactDOM entrypoint
│   ├── App.tsx                  # App shell + routes
│   ├── index.css                # Tailwind/global css
│   │
│   ├── assets/
│   │   ├── icons/
│   │   └── images/
│   │
│   ├── app/
│   │   ├── router.tsx           # React Router config
│   │   ├── providers.tsx        # Query/socket/theme providers
│   │   └── store.ts             # Zustand / Redux store
│   │
│   ├── pages/
│   │   ├── HomePage.tsx         # Landing + join game
│   │   ├── GamePage.tsx         # Main realtime board page
│   │   ├── LeaderboardPage.tsx
│   │   └── NotFoundPage.tsx
│   │
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Loader.tsx
│   │   │   ├── Badge.tsx
│   │   │   └── Tooltip.tsx
│   │   │
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── AppLayout.tsx
│   │   │
│   │   ├── game/
│   │   │   ├── GridBoard.tsx        # renders tile matrix
│   │   │   ├── Tile.tsx             # single tile
│   │   │   ├── TileLayer.tsx        # optimized rows/layers
│   │   │   ├── ClaimAnimation.tsx
│   │   │   ├── ZoomControls.tsx
│   │   │   ├── MiniMap.tsx
│   │   │   └── PlayerCursor.tsx
│   │   │
│   │   └── stats/
│   │       ├── Leaderboard.tsx
│   │       ├── OnlineUsers.tsx
│   │       ├── UserCard.tsx
│   │       └── MatchStats.tsx
│   │
│   ├── features/
│   │   ├── auth/
│   │   │   ├── auth.api.ts
│   │   │   ├── auth.store.ts
│   │   │   ├── auth.types.ts
│   │   │   └── useGuestLogin.ts
│   │   │
│   │   ├── game/
│   │   │   ├── game.api.ts
│   │   │   ├── game.store.ts
│   │   │   ├── game.types.ts
│   │   │   ├── useGameSocket.ts
│   │   │   ├── useClaimTile.ts
│   │   │   └── selectors.ts
│   │   │
│   │   └── leaderboard/
│   │       ├── leaderboard.api.ts
│   │       └── leaderboard.store.ts
│   │
│   ├── hooks/
│   │   ├── useSocket.ts
│   │   ├── useDebounce.ts
│   │   ├── useThrottle.ts
│   │   ├── useLocalStorage.ts
│   │   └── useWindowSize.ts
│   │
│   ├── services/
│   │   ├── api.ts               # axios instance
│   │   ├── socket.ts            # socket.io client singleton
│   │   └── queryClient.ts
│   │
│   ├── lib/
│   │   ├── cn.ts                # classnames helper
│   │   ├── colors.ts
│   │   ├── constants.ts
│   │   ├── tile.ts              # tile helpers
│   │   └── animations.ts
│   │
│   ├── types/
│   │   ├── api.ts
│   │   ├── user.ts
│   │   └── game.ts
│   │
│   └── styles/
│       ├── utilities.css
│       └── animations.css
│
└── tests/
    ├── unit/
    └── e2e/


Entry point : 

main.tsx
  ↓
App.tsx
  ↓
providers.tsx
  ↓
router.tsx
  ↓
GamePage.tsx
  ↓
GridBoard.tsx
  ↓
Tile.tsx


