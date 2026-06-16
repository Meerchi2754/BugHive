ALTER TABLE public.shortlist_contributors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "shortlist_contributors_select_policy"
ON public.shortlist_contributors
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.shortlists
    WHERE shortlists.id = shortlist_contributors.shortlist_id
    AND shortlists.maintainer_id = auth.uid()
  )
);

CREATE POLICY "shortlist_contributors_insert_policy"
ON public.shortlist_contributors
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.shortlists
    WHERE shortlists.id = shortlist_contributors.shortlist_id
    AND shortlists.maintainer_id = auth.uid()
  )
);