-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create enum for docket types
CREATE TYPE public.docket_type AS ENUM ('packers_movers', 'ptl_ftl', 'other_services', 'courier_ecommerce');

-- Create enum for shipment status
CREATE TYPE public.shipment_status AS ENUM ('pending', 'in_transit', 'delivered', 'cancelled');

-- Create enum for course difficulty
CREATE TYPE public.course_difficulty AS ENUM ('beginner', 'intermediate', 'advanced', 'expert');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Create security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
ON public.user_roles FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Company settings table
CREATE TABLE public.company_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL DEFAULT 'Yatayaat Logistics',
  address TEXT NOT NULL DEFAULT 'B/31/H/4 Gobra Gorasthan Road, Kolkata-700046',
  phone_primary TEXT NOT NULL DEFAULT '7044711417',
  phone_secondary TEXT DEFAULT '6289984889',
  email TEXT NOT NULL DEFAULT 'yatayaatlogistics@gmail.com',
  gst_number TEXT,
  logo_url TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by UUID REFERENCES auth.users(id)
);

-- Insert default company settings
INSERT INTO public.company_settings (company_name, address, phone_primary, phone_secondary, email) 
VALUES ('Yatayaat Logistics', 'B/31/H/4 Gobra Gorasthan Road, Kolkata-700046', '7044711417', '6289984889', 'yatayaatlogistics@gmail.com');

ALTER TABLE public.company_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view company settings"
ON public.company_settings FOR SELECT
USING (true);

CREATE POLICY "Admins can update company settings"
ON public.company_settings FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

-- GST rates table
CREATE TABLE public.gst_rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_category TEXT NOT NULL,
  gst_percentage DECIMAL(5,2) NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Insert Indian GST rates
INSERT INTO public.gst_rates (service_category, gst_percentage, description) VALUES
('transport_goods', 5.00, 'Goods Transport Agency Services'),
('transport_passengers', 5.00, 'Passenger Transport Services'),
('packers_movers', 18.00, 'Packers and Movers Services'),
('courier', 18.00, 'Courier and Logistics Services'),
('warehousing', 18.00, 'Warehousing and Storage Services'),
('other_services', 18.00, 'Other Logistics Services');

ALTER TABLE public.gst_rates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view GST rates"
ON public.gst_rates FOR SELECT
USING (true);

CREATE POLICY "Admins can manage GST rates"
ON public.gst_rates FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Dockets table
CREATE TABLE public.dockets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  docket_number TEXT NOT NULL UNIQUE,
  docket_type docket_type NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  customer_address TEXT NOT NULL,
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  distance_km DECIMAL(10,2),
  pickup_date DATE NOT NULL,
  delivery_date DATE,
  
  -- Service specific fields
  vehicle_type TEXT,
  vehicle_number TEXT,
  driver_name TEXT,
  driver_phone TEXT,
  
  -- Item details
  item_description TEXT,
  quantity INTEGER,
  weight_kg DECIMAL(10,2),
  volume_cbm DECIMAL(10,2),
  declared_value DECIMAL(12,2),
  
  -- Pricing
  base_amount DECIMAL(12,2) NOT NULL,
  gst_percentage DECIMAL(5,2) NOT NULL DEFAULT 18.00,
  gst_amount DECIMAL(12,2) NOT NULL,
  total_amount DECIMAL(12,2) NOT NULL,
  
  -- Payment
  payment_mode TEXT,
  payment_status TEXT DEFAULT 'pending',
  advance_paid DECIMAL(12,2) DEFAULT 0,
  balance_due DECIMAL(12,2),
  
  -- Status and tracking
  status shipment_status DEFAULT 'pending',
  notes TEXT,
  terms_conditions TEXT,
  
  -- Metadata
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  version INTEGER DEFAULT 1,
  is_deleted BOOLEAN DEFAULT false
);

ALTER TABLE public.dockets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active dockets"
ON public.dockets FOR SELECT
USING (is_deleted = false);

CREATE POLICY "Authenticated users can create dockets"
ON public.dockets FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage all dockets"
ON public.dockets FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Docket history for version control
CREATE TABLE public.docket_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  docket_id UUID NOT NULL REFERENCES public.dockets(id) ON DELETE CASCADE,
  version INTEGER NOT NULL,
  changes JSONB NOT NULL,
  changed_by UUID REFERENCES auth.users(id),
  changed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.docket_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view docket history"
ON public.docket_history FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Blog posts table
CREATE TABLE public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT NOT NULL,
  featured_image TEXT,
  category TEXT NOT NULL,
  tags TEXT[],
  author_id UUID REFERENCES auth.users(id),
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  views_count INTEGER DEFAULT 0,
  seo_title TEXT,
  seo_description TEXT,
  seo_keywords TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published posts"
ON public.blog_posts FOR SELECT
USING (is_published = true);

CREATE POLICY "Admins can manage all posts"
ON public.blog_posts FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Courses table
CREATE TABLE public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  difficulty course_difficulty NOT NULL,
  duration_weeks INTEGER NOT NULL,
  university_price DECIMAL(12,2),
  features TEXT[],
  enrolled_count INTEGER DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  thumbnail_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Insert default courses
INSERT INTO public.courses (title, slug, description, difficulty, duration_weeks, university_price, features, enrolled_count, rating) VALUES
('Supply Chain Fundamentals', 'supply-chain-fundamentals', 'Master the basics of supply chain management, logistics principles, and industry best practices.', 'beginner', 6, 150000, ARRAY['Supply chain design principles', 'Inventory management strategies', 'Transportation optimization', 'Vendor relationship management', 'Cost analysis and budgeting', 'Industry case studies'], 2500, 4.9),
('Digital Logistics & Technology', 'digital-logistics-technology', 'Learn cutting-edge logistics technology, AI applications, and digital transformation strategies.', 'advanced', 8, 350000, ARRAY['IoT in supply chain', 'AI and machine learning applications', 'Blockchain in logistics', 'Predictive analytics', 'Digital transformation roadmap', 'Future trends and innovations'], 1800, 4.8),
('International Trade & Shipping', 'international-trade-shipping', 'Master global logistics, international shipping, customs procedures, and trade regulations.', 'intermediate', 7, 280000, ARRAY['International shipping modes', 'Customs documentation', 'Incoterms and trade terms', 'Export-import procedures', 'Freight forwarding', 'Global compliance requirements'], 1200, 4.7),
('Logistics Business Management', 'logistics-business-management', 'Learn to start, scale, and manage your own logistics business with proven strategies and frameworks.', 'expert', 10, 450000, ARRAY['Business model development', 'Financial planning and analysis', 'Operations scaling strategies', 'Team building and management', 'Technology implementation', 'Growth hacking techniques'], 900, 4.9);

ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active courses"
ON public.courses FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins can manage courses"
ON public.courses FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Course enrollments
CREATE TABLE public.course_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  progress INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT false,
  certificate_issued BOOLEAN DEFAULT false,
  enrolled_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  UNIQUE(course_id, user_id)
);

ALTER TABLE public.course_enrollments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own enrollments"
ON public.course_enrollments FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can enroll in courses"
ON public.course_enrollments FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own enrollments"
ON public.course_enrollments FOR UPDATE
USING (auth.uid() = user_id);

-- Agent/Commission program
CREATE TABLE public.agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  agent_code TEXT NOT NULL UNIQUE,
  company_name TEXT,
  contact_person TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  address TEXT,
  commission_percentage DECIMAL(5,2) NOT NULL DEFAULT 10.00,
  payment_mode TEXT DEFAULT 'bank_transfer',
  bank_details JSONB,
  is_active BOOLEAN DEFAULT true,
  total_earnings DECIMAL(12,2) DEFAULT 0,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Agents can view their own profile"
ON public.agents FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Agents can update their own profile"
ON public.agents FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can register as agents"
ON public.agents FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all agents"
ON public.agents FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Agent loads/bookings
CREATE TABLE public.agent_loads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID NOT NULL REFERENCES public.agents(id) ON DELETE CASCADE,
  docket_id UUID REFERENCES public.dockets(id) ON DELETE SET NULL,
  load_details TEXT NOT NULL,
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  service_type TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  base_amount DECIMAL(12,2) NOT NULL,
  commission_amount DECIMAL(12,2) NOT NULL,
  status TEXT DEFAULT 'pending',
  payment_status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.agent_loads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Agents can view their own loads"
ON public.agent_loads FOR SELECT
USING (agent_id IN (SELECT id FROM public.agents WHERE user_id = auth.uid()));

CREATE POLICY "Agents can create loads"
ON public.agent_loads FOR INSERT
WITH CHECK (agent_id IN (SELECT id FROM public.agents WHERE user_id = auth.uid()));

CREATE POLICY "Admins can manage all agent loads"
ON public.agent_loads FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Case studies
CREATE TABLE public.case_studies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  region TEXT NOT NULL,
  challenge TEXT NOT NULL,
  solution TEXT NOT NULL,
  results TEXT NOT NULL,
  key_metrics JSONB,
  featured_image TEXT,
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  views_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.case_studies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published case studies"
ON public.case_studies FOR SELECT
USING (is_published = true);

CREATE POLICY "Admins can manage case studies"
ON public.case_studies FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Courier pin codes
CREATE TABLE public.pin_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pin_code TEXT NOT NULL UNIQUE,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  region TEXT NOT NULL,
  is_serviceable BOOLEAN DEFAULT true,
  base_rate DECIMAL(10,2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.pin_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view pin codes"
ON public.pin_codes FOR SELECT
USING (is_serviceable = true);

CREATE POLICY "Admins can manage pin codes"
ON public.pin_codes FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Lead generation/scraping data
CREATE TABLE public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source TEXT NOT NULL,
  company_name TEXT NOT NULL,
  contact_person TEXT,
  phone TEXT,
  email TEXT,
  address TEXT,
  industry TEXT,
  status TEXT DEFAULT 'new',
  notes TEXT,
  scraped_data JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage leads"
ON public.leads FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Create trigger for updating timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER update_dockets_updated_at BEFORE UPDATE ON public.dockets
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_company_settings_updated_at BEFORE UPDATE ON public.company_settings
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON public.blog_posts
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON public.courses
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_agents_updated_at BEFORE UPDATE ON public.agents
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_agent_loads_updated_at BEFORE UPDATE ON public.agent_loads
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_case_studies_updated_at BEFORE UPDATE ON public.case_studies
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();