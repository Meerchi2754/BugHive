DROP POLICY "USER,RESPECTIVE VERIFIER AND CONTRIBUTOR CAN SEE THE USER DATA" ON users;

CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER  -- runs as DB owner, bypasses RLS
SET search_path = public
AS $$
  SELECT role FROM public.users WHERE id = auth.uid();
$$;

CREATE POLICY "USER,RESPECTIVE VERIFIER AND CONTRIBUTOR CAN SEE THE USER DATA"
ON "public"."users"
TO public
USING (
  -- 1. User can see their own data
  (auth.uid() = id)

  -- 2. Assigned verifier can see the user
  OR (id IN (
    SELECT verifications.user_id
    FROM verifications
    WHERE lower(verifications.verifier_email) = lower(auth.email())
  ))

  -- 3. Maintainer can see all contributors (no recursion)
  OR (
    public.get_my_role() = 'MAINTAINER'
    AND role = 'CONTRIBUTOR'
  )
);