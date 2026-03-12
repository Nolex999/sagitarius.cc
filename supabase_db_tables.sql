-- SAGITARR - Tables DB (Célébrités, Lycée)
-- Exécute dans l'éditeur SQL Supabase

-- Table: celebrities
CREATE TABLE IF NOT EXISTS public.celebrities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

-- RLS
ALTER TABLE public.celebrities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read celebrities"
  ON public.celebrities FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert celebrities"
  ON public.celebrities FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = created_by OR created_by IS NULL);

CREATE POLICY "Authenticated users can update celebrities"
  ON public.celebrities FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can delete celebrities"
  ON public.celebrities FOR DELETE TO authenticated USING (true);

-- Table: lycee_classes (sous-classes 2nde 1, 2nde 2, etc.)
CREATE TABLE IF NOT EXISTS public.lycee_classes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  order_index int NOT NULL DEFAULT 1,
  created_at timestamptz DEFAULT now()
);

-- RLS
ALTER TABLE public.lycee_classes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can manage lycee_classes"
  ON public.lycee_classes FOR ALL TO authenticated USING (true)
  WITH CHECK (true);

-- Table: lycee_entries
CREATE TABLE IF NOT EXISTS public.lycee_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id uuid NOT NULL REFERENCES public.lycee_classes(id) ON DELETE CASCADE,
  name text NOT NULL,
  info text,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

-- RLS
ALTER TABLE public.lycee_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can manage lycee_entries"
  ON public.lycee_entries FOR ALL TO authenticated USING (true)
  WITH CHECK (true);

-- Seed default lycee_classes (2nde 1 à 2nde 8)
INSERT INTO public.lycee_classes (name, order_index)
SELECT '2nde ' || i, i
FROM generate_series(1, 8) AS i
WHERE NOT EXISTS (SELECT 1 FROM public.lycee_classes LIMIT 1);
