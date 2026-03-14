-- Add columns to celebrities
ALTER TABLE public.celebrities ADD COLUMN IF NOT EXISTS email text;
ALTER TABLE public.celebrities ADD COLUMN IF NOT EXISTS habitation text;
ALTER TABLE public.celebrities ADD COLUMN IF NOT EXISTS telephone text;

-- Add columns to lycee_entries
ALTER TABLE public.lycee_entries ADD COLUMN IF NOT EXISTS email text;
ALTER TABLE public.lycee_entries ADD COLUMN IF NOT EXISTS habitation text;
ALTER TABLE public.lycee_entries ADD COLUMN IF NOT EXISTS telephone text;
