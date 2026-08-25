-- Create bids table (retry without IF NOT EXISTS for policies)
CREATE TABLE IF NOT EXISTS public.bids (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  load_type text NOT NULL,
  pickup_pincode text NOT NULL,
  pickup_landmark text,
  drop_pincode text NOT NULL,
  drop_landmark text,
  loading_unloading_scope text,
  vehicle_type text NOT NULL,
  expected_rate numeric,
  cargo_value numeric,
  special_preferences text,
  payment_terms text,
  contact_name text NOT NULL,
  contact_number text NOT NULL,
  detention_clause text,
  status text NOT NULL DEFAULT 'open',
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid
);

-- Enable RLS
ALTER TABLE public.bids ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY public_can_insert_bids
  ON public.bids
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY public_can_view_open_bids
  ON public.bids
  FOR SELECT
  TO public
  USING (status = 'open');

CREATE POLICY admins_can_view_all_bids
  ON public.bids
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
  ));

CREATE POLICY admins_can_update_bids
  ON public.bids
  FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
  ));

CREATE POLICY admins_can_delete_bids
  ON public.bids
  FOR DELETE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
  ));

-- Indexes
CREATE INDEX idx_bids_status ON public.bids(status);
CREATE INDEX idx_bids_created_at ON public.bids(created_at);

-- Realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.bids;