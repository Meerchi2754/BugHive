DROP POLICY IF EXISTS "USER CAN SELECT THEIR PR" ON pr_table;
CREATE POLICY "verifiers_can_view_pr_details" ON public.pr_table FOR
SELECT USING (
        EXISTS (
            SELECT 1
            FROM public.verifications v
                JOIN public.claims c ON c.id = v."claim_Id"
            WHERE c.pr_url = pr_table.pr_url
                AND v.user_id = auth.uid()
        )
    );