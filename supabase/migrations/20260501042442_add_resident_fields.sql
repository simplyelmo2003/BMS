-- Add birthday and civil status to residents table
ALTER TABLE public.residents
ADD COLUMN birthday DATE,
ADD COLUMN civil_status TEXT;

-- Update the updated_at trigger to include these new fields
-- (The trigger already updates on any update, so no change needed)