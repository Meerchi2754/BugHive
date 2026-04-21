DROP POLICY "USER CAN SELECT THEIR CLAIMS" ON claims;
CREATE POLICY "USER CAN SELECT THEIR CLAIMS" ON claims TO authenticated USING (
    auth.uid() = user_id
    OR EXISTS (
        SELECT 1
        FROM verifications
        WHERE verifications."claim_Id" = claims.id
            AND verifications.user_id = auth.uid()
    )
);