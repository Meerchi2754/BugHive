ALTER TABLE claims DROP COLUMN verifier_email;
CREATE TYPE EMAILVERIFIERSTATUS AS ENUM(
    'PENDING',
    'EXPIRED',
    'VERIFIED'
);
CREATE TABLE verifications(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    verifier_email text,
    claimId UUID NOT NULL REFERENCES claims(id),
    token text,
    status VERIFICATIONSTATUS DEFAULT 'PENDING',
    sended_at TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
)