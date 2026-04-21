DROP POLICY IF EXISTS "USER CAN SELECT THEIR CLAIMS" ON claims;
CREATE POLICY "USER CAN SELECT THEIR CLAIMS" ON claims FOR
SELECT TO authenticated USING (
        auth.uid() = user_id
        OR EXISTS (
            SELECT 1
            FROM verifications v
            WHERE v."claim_Id" = claims.id
                AND lower(v.verifier_email) = lower(auth.email())
        )
    );