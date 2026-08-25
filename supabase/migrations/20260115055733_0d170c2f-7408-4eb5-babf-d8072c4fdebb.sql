-- =============================================
-- CORE: Part Load Posts Table (if not exists)
-- =============================================
CREATE TABLE IF NOT EXISTS public.part_load_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES auth.users(id),
  load_title TEXT NOT NULL,
  goods_type TEXT,
  pickup_location TEXT NOT NULL,
  drop_location TEXT NOT NULL,
  weight_kg NUMERIC,
  volume_cft NUMERIC,
  expected_rate NUMERIC,
  pickup_date DATE,
  status TEXT DEFAULT 'active',
  photos TEXT[] DEFAULT '{}',
  material_photos TEXT[] DEFAULT '{}',
  estimated_space_cft NUMERIC,
  load_category TEXT,
  contact_name TEXT,
  contact_phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.part_load_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view all posts" ON public.part_load_posts;
CREATE POLICY "Users can view all posts"
ON public.part_load_posts
FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Users can create posts" ON public.part_load_posts;
CREATE POLICY "Users can create posts"
ON public.part_load_posts
FOR INSERT
WITH CHECK (auth.uid() = customer_id);

DROP POLICY IF EXISTS "Users can update own posts" ON public.part_load_posts;
CREATE POLICY "Users can update own posts"
ON public.part_load_posts
FOR UPDATE
USING (auth.uid() = customer_id);

-- =============================================
-- CORE: Part Load Bids Table
-- =============================================
CREATE TABLE IF NOT EXISTS public.part_load_bids (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES public.part_load_posts(id) ON DELETE CASCADE,
  transporter_id UUID REFERENCES auth.users(id),
  quoted_rate NUMERIC NOT NULL,
  truck_type TEXT,
  available_space_cft NUMERIC,
  route_details TEXT,
  remarks TEXT,
  photos TEXT[] DEFAULT '{}',
  truck_photos TEXT[] DEFAULT '{}',
  actual_space_available_cft NUMERIC,
  compatibility_score NUMERIC,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.part_load_bids ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view bids" ON public.part_load_bids;
CREATE POLICY "Users can view bids"
ON public.part_load_bids
FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Transporters can create bids" ON public.part_load_bids;
CREATE POLICY "Transporters can create bids"
ON public.part_load_bids
FOR INSERT
WITH CHECK (auth.uid() = transporter_id);

DROP POLICY IF EXISTS "Transporters can update bids" ON public.part_load_bids;
CREATE POLICY "Transporters can update bids"
ON public.part_load_bids
FOR UPDATE
USING (auth.uid() = transporter_id);

-- =============================================
-- CORE: Truck Space Records
-- =============================================
CREATE TABLE IF NOT EXISTS public.truck_space_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  transporter_id UUID REFERENCES auth.users(id),
  truck_number TEXT NOT NULL,
  truck_type TEXT NOT NULL,
  total_capacity_cft NUMERIC NOT NULL,
  used_capacity_cft NUMERIC DEFAULT 0,
  current_location TEXT,
  destination TEXT,
  available_date DATE,
  is_available BOOLEAN DEFAULT true,
  photos TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.truck_space_records ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view trucks" ON public.truck_space_records;
CREATE POLICY "Anyone can view trucks"
ON public.truck_space_records
FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Transporters can manage trucks" ON public.truck_space_records;
CREATE POLICY "Transporters can manage trucks"
ON public.truck_space_records
FOR ALL
USING (auth.uid() = transporter_id);

-- =============================================
-- MODULE: SEO Pages
-- =============================================
CREATE TABLE IF NOT EXISTS public.seo_pages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_url TEXT NOT NULL UNIQUE,
  meta_title TEXT,
  meta_description TEXT,
  keywords TEXT[],
  og_title TEXT,
  og_description TEXT,
  og_image TEXT,
  schema_markup JSONB,
  canonical_url TEXT,
  sitemap_priority NUMERIC DEFAULT 0.5,
  last_audit_at TIMESTAMP WITH TIME ZONE,
  audit_score NUMERIC,
  issues JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.seo_pages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can manage SEO" ON public.seo_pages;
CREATE POLICY "Admins can manage SEO"
ON public.seo_pages
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- =============================================
-- MODULE: Lead Assignments
-- =============================================
CREATE TABLE IF NOT EXISTS public.lead_assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID,
  transporter_id UUID,
  assigned_by UUID,
  status TEXT DEFAULT 'pending',
  lead_type TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.lead_assignments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can manage lead assignments" ON public.lead_assignments;
CREATE POLICY "Admins can manage lead assignments"
ON public.lead_assignments
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);