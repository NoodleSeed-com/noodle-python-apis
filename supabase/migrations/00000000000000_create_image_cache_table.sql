-- Create generated_images table for image caching
CREATE TABLE IF NOT EXISTS public.generated_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    prompt_hash TEXT NOT NULL UNIQUE,
    image_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '30 days'
);

-- Create index for faster lookups by prompt hash
CREATE INDEX idx_generated_images_prompt_hash ON public.generated_images (prompt_hash);

-- Disable Row Level Security for now
ALTER TABLE public.generated_images DISABLE ROW LEVEL SECURITY;

-- Grant all permissions for testing
GRANT ALL ON TABLE public.generated_images TO anon;
GRANT ALL ON SCHEMA storage TO anon;
GRANT ALL ON ALL TABLES IN SCHEMA storage TO anon;
GRANT ALL ON ALL SEQUENCES IN SCHEMA storage TO anon;
GRANT ALL ON ALL ROUTINES IN SCHEMA storage TO anon;

-- Disable RLS on storage.objects
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;

-- Grant storage permissions
GRANT ALL ON TABLE storage.objects TO anon;
GRANT ALL ON TABLE storage.buckets TO anon;
