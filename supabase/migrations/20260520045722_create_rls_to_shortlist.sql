create policy "Only Maintainer can create shortlists"
on public.shortlists
for insert
to authenticated
with check (
  maintainer_id = auth.uid()
);