CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(30) UNIQUE NOT NULL,
    color VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    password_hash VARCHAR(255),
    role VARCHAR(20) NOT NULL DEFAULT 'player',
    is_guest BOOLEAN NOT NULL DEFAULT TRUE,
    auth_version INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

ALTER TABLE users ADD COLUMN IF NOT EXISTS email VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(20) NOT NULL DEFAULT 'player';
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_guest BOOLEAN NOT NULL DEFAULT TRUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS auth_version INT NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email_unique ON users ((lower(email))) WHERE email IS NOT NULL;

CREATE TABLE IF NOT EXISTS game_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    grid_rows INT NOT NULL,
    grid_cols INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    ended_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tiles (
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

CREATE INDEX IF NOT EXISTS idx_tiles_session ON tiles(session_id);
CREATE INDEX IF NOT EXISTS idx_tiles_owner ON tiles(owner_user_id);

CREATE TABLE IF NOT EXISTS tile_claim_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES game_sessions(id) ON DELETE CASCADE,
    tile_id UUID NOT NULL REFERENCES tiles(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    previous_owner_user_id UUID REFERENCES users(id),
    claimed_at TIMESTAMP NOT NULL DEFAULT NOW(),
    source VARCHAR(20) DEFAULT 'click'
);

CREATE INDEX IF NOT EXISTS idx_claim_events_user ON tile_claim_events(user_id);
CREATE INDEX IF NOT EXISTS idx_claim_events_tile ON tile_claim_events(tile_id);
CREATE INDEX IF NOT EXISTS idx_claim_events_session ON tile_claim_events(session_id);

CREATE TABLE IF NOT EXISTS user_stats (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    total_claims INT NOT NULL DEFAULT 0,
    tiles_owned INT NOT NULL DEFAULT 0,
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_cooldowns (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    last_claim_at TIMESTAMP
);
