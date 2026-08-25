-- Create reviews table with RLS
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  reviewer_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT NOT NULL,
  service_type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- RLS policies for reviews
CREATE POLICY "Anyone can view reviews" 
ON public.reviews 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can create reviews" 
ON public.reviews 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews" 
ON public.reviews 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews" 
ON public.reviews 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_reviews_updated_at
BEFORE UPDATE ON public.reviews
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert Packers and Movers Mastery Course
INSERT INTO public.courses (
  title,
  slug,
  description,
  difficulty,
  duration_weeks,
  university_price,
  features,
  enrolled_count,
  rating,
  is_active
) VALUES (
  'Packers & Movers Mastery Course',
  'packers-movers-mastery',
  'Comprehensive training on professional packing standards, methods, and materials for industrial, household, vehicle, and export shipments. Master the art of safe and efficient packing.',
  'intermediate',
  8,
  350000,
  ARRAY[
    'International packing standards and certifications (ISO, IATA)',
    'Industrial packing: Heavy machinery, equipment, and tools',
    'Household packing: Furniture, electronics, glassware, and artwork',
    'Vehicle packing: Cars, bikes, and specialized transport methods',
    'Export packing: Wooden crates, palletization, and fumigation',
    'Material selection: Bubble wrap, corrugated boxes, foam, stretch film',
    'Loading and unloading techniques for maximum safety',
    'Insurance claims and documentation procedures',
    'Quality control and damage prevention strategies',
    'Cost optimization and material waste reduction',
    'Hands-on training with real-world scenarios',
    'Industry certification upon completion'
  ],
  0,
  4.9,
  true
) ON CONFLICT (slug) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON public.reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON public.reviews(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_service_type ON public.reviews(service_type);