CREATE POLICY "USER CAN SELECT INTO THE CLAIMS TABLE" ON "public"."claims" WITH CHECK (auth.uid()=user_id);
