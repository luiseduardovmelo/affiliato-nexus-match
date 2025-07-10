-- Emergency RLS Fix Script
-- Run this if RLS is not enabled on production database

-- Enable RLS on all critical tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credits ENABLE ROW LEVEL SECURITY; 
ALTER TABLE public.reveal_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_specs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.operator_specs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Verify RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('users', 'credits', 'reveal_logs', 'affiliate_specs', 'operator_specs', 'reviews');

-- Check existing policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;