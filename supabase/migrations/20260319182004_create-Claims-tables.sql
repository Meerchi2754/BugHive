CREATE TYPE VERIFICATIONSTATUS AS ENUM (
    'PENDING',
    'ACCEPT',
    'DECLINED',
    'EXPIRED'
);
CREATE TYPE CLAIMTYPE AS ENUM (
    'BUG FIX',
    'FEATURE',
    'PERFORMANCE',
    'REFACTOR',
    'DOCUMENTATION',
    'MENTORING'
);
create TABLE claims(
    id uuid DEFAULT gen_random_uuid() primary key,
    user_id UUID NOT NULL,
    claim_title TEXT,
    PR_URL TEXT NOT NULL,
    claim_type CLAIMTYPE,
    description TEXT not null,
    visibility_level ACCOUNTMODE DEFAULT 'PUBLIC',
    verification_status VERIFICATIONSTATUS DEFAULT 'PENDING',
    claimImpactScore INTEGER not null,
    CONSTRAINT fk_users 
        FOREIGN KEY (user_id) 
        REFERENCES users(id)
);