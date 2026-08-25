-- Core logistics platform schema (no storage bucket changes)

-- Profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  company_name TEXT,
  phone TEXT,
  user_type TEXT CHECK (user_type IN ('shipper', 'carrier', 'admin', 'customer')) DEFAULT 'customer',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Shipments
CREATE TABLE public.shipments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  tracking_number TEXT UNIQUE NOT NULL,
  origin_address TEXT NOT NULL,
  destination_address TEXT NOT NULL,
  pickup_date TIMESTAMPTZ,
  delivery_date TIMESTAMPTZ,
  shipment_type TEXT CHECK (shipment_type IN ('air', 'sea', 'road', 'rail')) NOT NULL,
  weight DECIMAL(10, 2),
  dimensions JSONB,
  status TEXT CHECK (status IN ('pending', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered', 'cancelled')) DEFAULT 'pending',
  estimated_cost DECIMAL(10, 2),
  actual_cost DECIMAL(10, 2),
  ai_optimized_route JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tracking Events
CREATE TABLE public.tracking_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_id UUID REFERENCES public.shipments(id) ON DELETE CASCADE,
  location TEXT NOT NULL,
  coordinates JSONB,
  status TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Quotes
CREATE TABLE public.quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  shipment_type TEXT NOT NULL,
  weight DECIMAL(10, 2),
  dimensions JSONB,
  estimated_price DECIMAL(10, 2),
  ai_recommendations JSONB,
  status TEXT CHECK (status IN ('pending', 'accepted', 'rejected', 'expired')) DEFAULT 'pending',
  valid_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Payments
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  shipment_id UUID REFERENCES public.shipments(id) ON DELETE SET NULL,
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  payment_method TEXT,
  stripe_payment_id TEXT,
  status TEXT CHECK (status IN ('pending', 'completed', 'failed', 'refunded')) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- AI Chat History
CREATE TABLE public.ai_chat_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  response TEXT NOT NULL,
  context JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Documents metadata (files live in storage bucket 'documents')
CREATE TABLE public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  shipment_id UUID REFERENCES public.shipments(id) ON DELETE SET NULL,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  document_type TEXT,
  ai_extracted_data JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tracking_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_chat_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "profiles_select_own" ON public.profiles
FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles
FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles
FOR INSERT WITH CHECK (auth.uid() = id);

-- Shipments policies
CREATE POLICY "shipments_select_own" ON public.shipments
FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "shipments_insert_own" ON public.shipments
FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "shipments_update_own" ON public.shipments
FOR UPDATE USING (auth.uid() = user_id);

-- Tracking events policies
CREATE POLICY "tracking_events_select_by_owner" ON public.tracking_events
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.shipments s
    WHERE s.id = shipment_id AND s.user_id = auth.uid()
  )
);

-- Quotes policies
CREATE POLICY "quotes_select_own" ON public.quotes
FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "quotes_insert_own" ON public.quotes
FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "quotes_update_own" ON public.quotes
FOR UPDATE USING (auth.uid() = user_id);

-- Payments policies
CREATE POLICY "payments_select_own" ON public.payments
FOR SELECT USING (auth.uid() = user_id);

-- AI chat history policies
CREATE POLICY "ai_chat_select_own" ON public.ai_chat_history
FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "ai_chat_insert_own" ON public.ai_chat_history
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Documents policies
CREATE POLICY "documents_select_own" ON public.documents
FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "documents_insert_own" ON public.documents
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trg_shipments_updated_at
BEFORE UPDATE ON public.shipments
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();