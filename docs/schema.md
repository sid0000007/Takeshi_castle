// prisma/schema.prisma


-- =====================================================
-- REAL-TIME SHARED GRID APP (MVP)
-- PostgreSQL Schema
-- =====================================================

-- Optional UUID support
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- USERS
-- =====================================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    username VARCHAR(30) UNIQUE NOT NULL,
    color VARCHAR(20) NOT NULL,         -- hex / tailwind color / rgb

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_username ON users(username);


-- =====================================================
-- GAME SESSION (for future reset / seasons)
-- =====================================================
CREATE TABLE game_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    name VARCHAR(100) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'active', 
    -- active / paused / ended

    grid_rows INT NOT NULL,
    grid_cols INT NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    ended_at TIMESTAMP
);


-- =====================================================
-- TILES (CURRENT STATE)
-- One row = one tile in grid
-- =====================================================
CREATE TABLE tiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    session_id UUID NOT NULL REFERENCES game_sessions(id) ON DELETE CASCADE,

    row_index INT NOT NULL,
    col_index INT NOT NULL,

    owner_user_id UUID REFERENCES users(id) ON DELETE SET NULL,

    claimed_at TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),

    version INT NOT NULL DEFAULT 0,

    CONSTRAINT unique_tile_per_session UNIQUE(session_id, row_index, col_index)
);

CREATE INDEX idx_tiles_session ON tiles(session_id);
CREATE INDEX idx_tiles_owner ON tiles(owner_user_id);


-- =====================================================
-- TILE CLAIM HISTORY (AUDIT / LEADERBOARD / REPLAY)
-- =====================================================
CREATE TABLE tile_claim_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    session_id UUID NOT NULL REFERENCES game_sessions(id) ON DELETE CASCADE,
    tile_id UUID NOT NULL REFERENCES tiles(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    previous_owner_user_id UUID REFERENCES users(id),

    claimed_at TIMESTAMP NOT NULL DEFAULT NOW(),

    source VARCHAR(20) DEFAULT 'click'
);

CREATE INDEX idx_claim_events_user ON tile_claim_events(user_id);
CREATE INDEX idx_claim_events_tile ON tile_claim_events(tile_id);
CREATE INDEX idx_claim_events_session ON tile_claim_events(session_id);


-- =====================================================
-- USER STATS (FAST READ)
-- =====================================================
CREATE TABLE user_stats (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,

    total_claims INT NOT NULL DEFAULT 0,
    tiles_owned INT NOT NULL DEFAULT 0,

    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);


-- =====================================================
-- OPTIONAL COOLDOWN TRACKING
-- =====================================================
CREATE TABLE user_cooldowns (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,

    last_claim_at TIMESTAMP
);


-- =====================================================
-- SEED FIRST GAME SESSION
-- =====================================================
INSERT INTO game_sessions (
    name,
    status,
    grid_rows,
    grid_cols
)
VALUES (
    'Season 1',
    'active',
    20,
    20
);

-- =====================================================
-- GENERATE GRID TILES (20 x 20 = 400 tiles)
-- =====================================================
INSERT INTO tiles (
    session_id,
    row_index,
    col_index
)
SELECT
    gs.id,
    r,
    c
FROM game_sessions gs,
generate_series(0, 19) r,
generate_series(0, 19) c
WHERE gs.status = 'active';




