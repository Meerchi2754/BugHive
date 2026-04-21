CREATE POLICY "USER CAN UPDATE THIER OWN CLAIMS" ON claims FOR
UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);