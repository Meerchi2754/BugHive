CREATE TABLE pr_table(
    id UUID primary key gen_random_uuid(),
    pr_url text UNIQUE REFERENCES claims(pr_url),
    additions INTEGER,
    deletions INTEGER,
    body text,
    changed_files_count INTEGER,
    issue_url text,
    reviews text [],
    file_changes text [],
    merged_at TIMESTAMPTZ,
    pr_created_at TIMESTAMPTZ DEFAULT now(),
    pr_updated_at TIMESTAMPTZ DEFAULT now()
)