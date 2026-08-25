-- Add tertiary phone to company_settings
ALTER TABLE public.company_settings 
ADD COLUMN IF NOT EXISTS phone_tertiary TEXT;

-- Update existing company settings with the new phone number
UPDATE public.company_settings 
SET phone_tertiary = '6290992707' 
WHERE phone_tertiary IS NULL;