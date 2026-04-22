CREATE TABLE saved_searches (
    id uuid primary key default gen_random_uuid(),
    maintainer_id uuid not null references users(id) on delete cascade,
    name text not null,
    -- "Senior Rust Contributors" etc.
    filters jsonb not null,
    -- { ecosystem, min_score, type, language, availability }
    created_at timestamptz default now()
);
CREATE TABLE search_history (
    id uuid primary key default gen_random_uuid(),
    maintainer_id uuid not null references users(id) on delete cascade,
    filters jsonb not null,
    -- same shape as above
    searched_at timestamptz default now()
);