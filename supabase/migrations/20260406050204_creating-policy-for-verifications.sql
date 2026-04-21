ALTER TABLE public.verifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "USER CAN ADD THIER VERIFIER EMAIL INTO TABLE RESPECTIVE OF  THIER CLAIMID" ON "public"."verifications" FOR
INSERT with check(
        EXISTS (
            SELECT 1
            FROM claims c
            WHERE (c.id = "verifications"."claim_Id")
                AND (c.user_id = auth.uid())
        )
    );