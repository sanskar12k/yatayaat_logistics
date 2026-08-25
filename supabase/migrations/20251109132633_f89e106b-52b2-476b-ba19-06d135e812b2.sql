-- AI Lead Generator Table
CREATE TABLE public.ai_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL,
  contact_person TEXT,
  email TEXT,
  phone TEXT,
  industry TEXT,
  lead_source TEXT,
  confidence_score NUMERIC(3,2),
  potential_value NUMERIC(10,2),
  status TEXT DEFAULT 'new',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Discount Approvals Table
CREATE TABLE public.discount_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  discount_percentage NUMERIC(5,2) NOT NULL,
  order_value NUMERIC(10,2) NOT NULL,
  reason TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  requested_by UUID REFERENCES auth.users(id),
  approved_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Ad Management Table
CREATE TABLE public.ad_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_name TEXT NOT NULL,
  platform TEXT NOT NULL,
  budget NUMERIC(10,2),
  start_date DATE,
  end_date DATE,
  status TEXT DEFAULT 'draft',
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- SEO Monitoring Table
CREATE TABLE public.seo_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_url TEXT NOT NULL,
  keyword TEXT,
  ranking INTEGER,
  traffic INTEGER,
  bounce_rate NUMERIC(5,2),
  page_load_time NUMERIC(5,2),
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- System Health Table
CREATE TABLE public.system_health_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_name TEXT NOT NULL,
  status TEXT NOT NULL,
  response_time NUMERIC(10,2),
  error_count INTEGER DEFAULT 0,
  cpu_usage NUMERIC(5,2),
  memory_usage NUMERIC(5,2),
  checked_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Growth Metrics Table
CREATE TABLE public.growth_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_name TEXT NOT NULL,
  metric_value NUMERIC(10,2) NOT NULL,
  metric_type TEXT NOT NULL,
  period TEXT,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.ai_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discount_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ad_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_health_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.growth_metrics ENABLE ROW LEVEL SECURITY;

-- RLS Policies (Admin only access)
CREATE POLICY "Admins can view all leads" ON public.ai_leads FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert leads" ON public.ai_leads FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update leads" ON public.ai_leads FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete leads" ON public.ai_leads FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view discount requests" ON public.discount_requests FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert discount requests" ON public.discount_requests FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update discount requests" ON public.discount_requests FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete discount requests" ON public.discount_requests FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view ad campaigns" ON public.ad_campaigns FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert ad campaigns" ON public.ad_campaigns FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update ad campaigns" ON public.ad_campaigns FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete ad campaigns" ON public.ad_campaigns FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view seo metrics" ON public.seo_metrics FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert seo metrics" ON public.seo_metrics FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view system health" ON public.system_health_logs FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert system health" ON public.system_health_logs FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view growth metrics" ON public.growth_metrics FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert growth metrics" ON public.growth_metrics FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Indexes
CREATE INDEX idx_ai_leads_status ON public.ai_leads(status);
CREATE INDEX idx_discount_requests_status ON public.discount_requests(status);
CREATE INDEX idx_ad_campaigns_status ON public.ad_campaigns(status);
CREATE INDEX idx_seo_metrics_page ON public.seo_metrics(page_url);
CREATE INDEX idx_system_health_service ON public.system_health_logs(service_name);
CREATE INDEX idx_growth_metrics_type ON public.growth_metrics(metric_type);