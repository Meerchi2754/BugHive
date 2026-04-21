DROP POLICY "Allow user to check thier record" ON users;
CREATE POLICY "USER AND RESPECTIVE VERIFIER CAN SEE THE USER DATA" on users TO authenticated USING (
    (auth.uid() = id)
    OR (
        id IN (
            SELECT verifications.user_id
            FROM verifications
            WHERE (
                    lower(verifications.verifier_email) = lower(auth.email())
                )
        )
    )
)