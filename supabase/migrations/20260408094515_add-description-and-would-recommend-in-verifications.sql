ALTER TABLE verifications
ADD COLUMN descriptions text null,
    ADD COLUMN would_Recommend boolean default false