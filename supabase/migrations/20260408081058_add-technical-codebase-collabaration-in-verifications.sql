ALTER TABLE verifications
ADD COLUMN technical_complexity TYPE DECIMAL(2, 1) DEFAULT 1,
    ADD COLUMN codebase_impact TYPE DECIMAL(2, 1) DEFAULT 1,
    ADD COLUMN collaboration_quality TYPE DECIMAL(2, 1) DEFAULT 1;