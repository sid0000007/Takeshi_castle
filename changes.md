# UI Revamp Plan

## Goal
Transform the current multiplayer grid app UI to match the visual language of the reference product:

- calm cream backgrounds
- mint-to-lime gradient hero surfaces
- deep teal text and controls
- soft rounded cards and panels
- clean admin/dashboard-style information density
- polished modal/dialog behavior
- clear hierarchy without visual clutter

This is not a minor polish pass. The app should feel like it belongs to the same design family as the reference screens.

---

## Reference Design Language

## 1. Color System
- Base canvas: warm off-white / cream
- Primary gradient: emerald to lime
- Primary text: deep teal / dark green
- Secondary text: muted teal-gray
- Accent chips: pale mint, pale yellow, soft aqua
- Borders: thin, cool green-gray with low contrast

### Proposed tokens
- `--bg-app`: `#f7f8ef`
- `--bg-panel`: `#fbfcf6`
- `--bg-panel-alt`: `#f2f7ef`
- `--text-strong`: `#204f4b`
- `--text-muted`: `#6c8e88`
- `--border-soft`: `#cfe3d9`
- `--accent-teal`: `#2f7c76`
- `--accent-mint`: `#7ad7c8`
- `--accent-lime`: `#b8f12d`
- `--accent-warm`: `#fff1b8`

## 2. Shape Language
- Large rounded hero containers
- Rounded tabs and pills
- Rounded dashboard cards with subtle stroke
- Dialogs with large radius and generous padding
- Buttons should feel “product UI”, not generic Tailwind blocks

## 3. Layout Language
- Persistent left sidebar on larger screens
- Top content hero section with title, metadata, and action pills
- Tabbed content region under the hero
- White/cream panels floating over a soft gradient field
- Stats presented as dashboard cards instead of plain badges

## 4. Motion Language
- Framer Motion for:
  - page/header reveal
  - tab highlight transitions
  - dialog open/close
  - card stagger
  - tile claim ownership transitions
  - live overview HUD appearance
- Motion should be soft and short, not flashy

---

## Current UI Gaps

## 1. App shell mismatch
Current shell is dark and game-like. Reference is light, calm, and admin-product oriented.

## 2. Landing/auth mismatch
Current auth page is simplified but still does not match the reference split-product/login feel.

## 3. Game page mismatch
Current game HUD is functional but still reads as a custom game board, not a refined dashboard/product interface.

## 4. Ownership clarity
Claimed tiles show ownership, but the presentation is still too minimal compared to the stronger status/assignment style in the reference.

## 5. Dialog style mismatch
The live overview dialog works, but it does not yet visually match the reference modal surfaces and spacing.

---

## Revamp Scope

## Phase 1 - Design Tokens and Global Theme
Update:
- `apps/web/src/index.css`

Work:
- Introduce CSS variables for the full light theme
- Replace dark global canvas with cream background
- Add reusable gradients, borders, shadows, and text tokens
- Create utility classes for hero gradient surfaces, dashboard cards, pills, and soft panels

Acceptance:
- The app no longer looks dark by default
- Shared surfaces consistently use the same design language

## Phase 2 - App Shell and Navigation
Update:
- `apps/web/src/components/layout/AppLayout.tsx`

Work:
- Replace current thin top nav with a reference-style structure:
  - left sidebar navigation
  - top hero section for current screen
  - cleaner user/logout area
- Sidebar should include:
  - Game
  - Leaderboard
  - Overview
  - Admin actions if admin
- Add responsive fallback for smaller screens

Acceptance:
- The shell visually resembles the reference dashboard layout
- Navigation feels persistent and structured

## Phase 3 - Auth Screen Redesign
Update:
- `apps/web/src/pages/HomePage.tsx`

Work:
- Convert auth page to a split layout inspired by Image #1
- Left section:
  - clean login/register form
  - product identity
  - concise copy
- Right section:
  - gradient feature panel
  - rotating or stacked capability cards
  - “capture / sync / control” type messaging adapted for this app
- Keep simple auth flow, but present it in the reference style

Acceptance:
- Auth page matches reference color and composition
- It feels like a product login, not a rough game entry page

## Phase 4 - Game Hero and Tabs
Update:
- `apps/web/src/pages/GamePage.tsx`

Work:
- Introduce a large hero header similar to Images #5 and #6
- Show:
  - session name
  - player count
  - claimed tiles
  - current phase badge
  - live overview action
  - admin reset action
- Add pill/tab style navigation sections inside the page:
  - Overview
  - Grid
  - Players
  - Leaderboard

Acceptance:
- The top section becomes the main identity of the screen
- The game page feels like a premium live control surface

## Phase 5 - Stats Cards and Live Summary
Update:
- `apps/web/src/pages/GamePage.tsx`
- add new small components under `apps/web/src/components/stats/`

Work:
- Replace plain badges with dashboard cards similar to Image #2
- Add cards for:
  - Total claimed tiles
  - Online players
  - My claimed tiles
  - Active leaders
- Add a live player summary section using softly bordered cards

Acceptance:
- Status information becomes visually scan-friendly
- Cards align with the reference dashboard feel

## Phase 6 - Board Container and Controls
Update:
- `apps/web/src/components/game/GridBoard.tsx`
- `apps/web/src/components/game/ZoomControls.tsx`

Work:
- Wrap the board inside a soft panel instead of a dark frame
- Integrate zoom controls into a more polished toolbar
- Add board metadata strip:
  - zoom level
  - interaction hint
  - ownership legend
- Keep pan/scroll behavior but refine the visual container

Acceptance:
- The grid sits inside a product-style workspace panel
- Controls feel designed, not bolted on

## Phase 7 - Tile Visual System
Update:
- `apps/web/src/components/game/Tile.tsx`
- `apps/web/src/components/game/BombSplash.tsx`

Work:
- Redesign tiles so ownership reads more like assigned slots/status cells
- Stronger states:
  - unclaimed
  - hoverable claim target
  - owned by self
  - owned by another player
- Improve label hierarchy:
  - owner name
  - coordinates
  - status chip
- Keep bomb splash, but align it to the softer palette and polish level

Acceptance:
- Ownership is instantly understandable
- Tiles feel premium and readable at scale

## Phase 8 - Live Overview Dialog Redesign
Update:
- `apps/web/src/components/game/LiveOverviewDialog.tsx`

Work:
- Match reference modal language from Image #4
- Add:
  - top action row
  - player/team cards with progress bars
  - better spacing
  - optional multi-column layout toggle
- Replace the current generic overlay with a more product-like dialog

Acceptance:
- The modal feels aligned with the reference screens
- It becomes a strong “live control” centerpiece

## Phase 9 - Players and Leaderboard Surfaces
Update:
- `apps/web/src/components/stats/Leaderboard.tsx`
- add player list / overview components

Work:
- Redesign leaderboard to resemble Image #3 table/list treatment
- Use rows with:
  - player identity
  - role/status chip
  - tiles owned
  - average position
  - online indicator
- Support admin-friendly scanning

Acceptance:
- Player data feels structured and mature
- Not just a vertical list of cards

## Phase 10 - Motion and Micro-interactions
Update:
- relevant page/component files

Work:
- Add motion primitives for:
  - sidebar state
  - hero reveal
  - stat card entrance
  - tab switching
  - dialog transitions
  - tile claim ownership transitions
  - hover states on controls and rows

Acceptance:
- Interface feels alive and polished
- Motion improves clarity rather than distracting

---

## File-Level Execution Map

## Must update
- `apps/web/src/index.css`
- `apps/web/src/components/layout/AppLayout.tsx`
- `apps/web/src/pages/HomePage.tsx`
- `apps/web/src/pages/GamePage.tsx`
- `apps/web/src/components/game/GridBoard.tsx`
- `apps/web/src/components/game/Tile.tsx`
- `apps/web/src/components/game/BombSplash.tsx`
- `apps/web/src/components/game/LiveOverviewDialog.tsx`
- `apps/web/src/components/game/ZoomControls.tsx`
- `apps/web/src/components/stats/Leaderboard.tsx`

## Likely add
- `apps/web/src/components/layout/Sidebar.tsx`
- `apps/web/src/components/stats/StatCard.tsx`
- `apps/web/src/components/stats/OverviewPanel.tsx`
- `apps/web/src/components/game/BoardToolbar.tsx`
- `apps/web/src/components/game/OwnershipLegend.tsx`
- `apps/web/src/components/game/PlayersTable.tsx`

---

## Design Rules During Implementation

- Prefer cream + teal + lime palette consistently
- Avoid dark mode styling unless specifically for tiny accents
- Use whitespace and layout hierarchy over heavy borders
- Keep panels large-radius and soft-shadowed
- Use Framer Motion intentionally, not everywhere
- Use simple iconography and pill tabs
- Keep the board functional first, decorative second
- Make admin and player surfaces feel like the same system

---

## Recommended Execution Order

1. Global theme and layout shell
2. Auth page redesign
3. Game hero and stat cards
4. Grid container and tile system
5. Live overview modal redesign
6. Leaderboard/player table redesign
7. Motion polish and responsive cleanup

---

## Success Criteria

- The app visually belongs to the same product family as the reference images
- The palette, spacing, and surfaces feel consistent across auth, dashboard, and gameplay
- Ownership and live state are clearer than in the current UI
- The game remains responsive and usable while looking more premium
- The result feels intentionally designed, not just “styled with Tailwind”
