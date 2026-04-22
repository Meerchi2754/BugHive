CREATE TABLE shortlists (
    id uuid primary key default gen_random_uuid(),
    maintainer_id uuid not null references users(id) on delete cascade,
    name text not null,
    created_at timestamptz default now()
);
CREATE TABLE shortlist_contributors (
    id uuid primary key default gen_random_uuid(),
    shortlist_id uuid not null references shortlists(id) on delete cascade,
    contributor_id uuid not null references users(id) on delete cascade,
    note text,
    added_at timestamptz default now(),
    unique(shortlist_id, contributor_id) -- prevent duplicates
);
