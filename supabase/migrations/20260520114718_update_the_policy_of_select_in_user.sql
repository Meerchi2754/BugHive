
DROP POLICY "USER AND RESPECTIVE VERIFIER CAN SEE THE USER DATA" ON users;

CREATE POLICY "USER,RESPECTIVE VERIFIER AND CONTRIBUTOR CAN SEE THE USER DATA"
ON "public"."users"
TO public
USING (
  (auth.uid() = id)

  OR (id IN (
    SELECT verifications.user_id
    FROM verifications
    WHERE lower(verifications.verifier_email) = lower(auth.email())
  ))
  OR (
    EXISTS (
      SELECT 1 FROM users AS me
      WHERE me.id = auth.uid()
        AND me.role = 'MAINTAINER'
    )
    AND role = 'CONTRIBUTOR'  -- "role" here refers to the row being evaluated
  )
);

