create policy "Maintiaer can view their own shortlist rows"
on public.shortlists
for select
to authenticated
using (
  maintainer_id = auth.uid()
);