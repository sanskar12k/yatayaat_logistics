-- Create quote_requests table for storing customer quote submissions
CREATE TABLE IF NOT EXISTS public.quote_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  company_name TEXT,
  service_type TEXT NOT NULL,
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  weight DECIMAL,
  dimensions TEXT,
  shipment_value DECIMAL,
  quantity INTEGER,
  special_requirements TEXT,
  preferences TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'quoted', 'closed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.quote_requests ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert quote requests (public form)
CREATE POLICY "Anyone can submit quote requests"
  ON public.quote_requests
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Only authenticated users with admin role can view all quote requests
CREATE POLICY "Admins can view all quote requests"
  ON public.quote_requests
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

-- Only authenticated users with admin role can update quote requests
CREATE POLICY "Admins can update quote requests"
  ON public.quote_requests
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

-- Create trigger for updated_at
CREATE TRIGGER update_quote_requests_updated_at
  BEFORE UPDATE ON public.quote_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for quote attachments (if not exists)
INSERT INTO storage.buckets (id, name)
VALUES ('quote-attachments', 'quote-attachments')
ON CONFLICT (id) DO NOTHING;

-- Storage policies for quote attachments
CREATE POLICY "Anyone can upload quote attachments"
  ON storage.objects
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (bucket_id = 'quote-attachments');

CREATE POLICY "Admins can view quote attachments"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'quote-attachments' AND
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete quote attachments"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'quote-attachments' AND
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );