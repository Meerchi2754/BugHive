ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS banner_url text NULL;
