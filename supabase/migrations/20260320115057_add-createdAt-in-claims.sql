ALTER TABLE claims
ADD COLUMN createdAt timestamptz DEFAULT timezone('GMT', now()) NOT NULL;