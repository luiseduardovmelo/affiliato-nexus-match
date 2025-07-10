
-- First, let's check if RLS is enabled and re-apply the policies
-- Enable Row Level Security on all tables (in case it got disabled)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_specs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.operator_specs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reveal_logs ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to recreate them properly
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
DROP POLICY IF EXISTS "Admins can update all users" ON public.users;
DROP POLICY IF EXISTS "Allow user creation during registration" ON public.users;

DROP POLICY IF EXISTS "Users can manage their own affiliate profile" ON public.affiliate_specs;
DROP POLICY IF EXISTS "Everyone can view active affiliate profiles" ON public.affiliate_specs;

DROP POLICY IF EXISTS "Users can manage their own operator profile" ON public.operator_specs;
DROP POLICY IF EXISTS "Everyone can view active operator profiles" ON public.operator_specs;

DROP POLICY IF EXISTS "Users can create reviews" ON public.reviews;
DROP POLICY IF EXISTS "Users can update their own reviews" ON public.reviews;
DROP POLICY IF EXISTS "Everyone can view reviews" ON public.reviews;
DROP POLICY IF EXISTS "Users can delete their own reviews" ON public.reviews;
DROP POLICY IF EXISTS "Admins can manage all reviews" ON public.reviews;

DROP POLICY IF EXISTS "Users can view their own credits" ON public.credits;
DROP POLICY IF EXISTS "System can create credit transactions" ON public.credits;
DROP POLICY IF EXISTS "Admins can view all credits" ON public.credits;

DROP POLICY IF EXISTS "Users can view their reveal activities" ON public.reveal_logs;
DROP POLICY IF EXISTS "Users can create reveal logs" ON public.reveal_logs;
DROP POLICY IF EXISTS "Admins can view all reveal logs" ON public.reveal_logs;

-- Recreate the security definer function
DROP FUNCTION IF EXISTS public.get_current_user_role();
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT role::text FROM public.users WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Create function to check if user has specific role
DROP FUNCTION IF EXISTS public.has_role(uuid, text);
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role text)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = _user_id AND role::text = _role
  );
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- USERS TABLE POLICIES
CREATE POLICY "Users can view their own profile" 
  ON public.users 
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.users 
  FOR UPDATE 
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id AND 
    -- Prevent role escalation - users cannot change their own role unless they're admin
    (OLD.role = NEW.role OR public.has_role(auth.uid(), 'admin'))
  );

CREATE POLICY "Admins can view all users" 
  ON public.users 
  FOR SELECT 
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update all users" 
  ON public.users 
  FOR UPDATE 
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Allow user creation during registration" 
  ON public.users 
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- AFFILIATE_SPECS TABLE POLICIES
CREATE POLICY "Users can manage their own affiliate profile" 
  ON public.affiliate_specs 
  FOR ALL 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Everyone can view active affiliate profiles" 
  ON public.affiliate_specs 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = affiliate_specs.user_id 
      AND status = 'active'
    )
  );

-- OPERATOR_SPECS TABLE POLICIES
CREATE POLICY "Users can manage their own operator profile" 
  ON public.operator_specs 
  FOR ALL 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Everyone can view active operator profiles" 
  ON public.operator_specs 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = operator_specs.user_id 
      AND status = 'active'
    )
  );

-- REVIEWS TABLE POLICIES
CREATE POLICY "Users can create reviews" 
  ON public.reviews 
  FOR INSERT 
  WITH CHECK (
    auth.uid() = reviewer_id AND
    auth.uid() != target_id -- Users cannot review themselves
  );

CREATE POLICY "Users can update their own reviews" 
  ON public.reviews 
  FOR UPDATE 
  USING (auth.uid() = reviewer_id)
  WITH CHECK (auth.uid() = reviewer_id);

CREATE POLICY "Everyone can view reviews" 
  ON public.reviews 
  FOR SELECT 
  USING (true);

CREATE POLICY "Users can delete their own reviews" 
  ON public.reviews 
  FOR DELETE 
  USING (auth.uid() = reviewer_id);

CREATE POLICY "Admins can manage all reviews" 
  ON public.reviews 
  FOR ALL 
  USING (public.has_role(auth.uid(), 'admin'));

-- CREDITS TABLE POLICIES
CREATE POLICY "Users can view their own credits" 
  ON public.credits 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "System can create credit transactions" 
  ON public.credits 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all credits" 
  ON public.credits 
  FOR SELECT 
  USING (public.has_role(auth.uid(), 'admin'));

-- REVEAL_LOGS TABLE POLICIES
CREATE POLICY "Users can view their reveal activities" 
  ON public.reveal_logs 
  FOR SELECT 
  USING (auth.uid() = revealer_id OR auth.uid() = target_id);

CREATE POLICY "Users can create reveal logs" 
  ON public.reveal_logs 
  FOR INSERT 
  WITH CHECK (auth.uid() = revealer_id);

CREATE POLICY "Admins can view all reveal logs" 
  ON public.reveal_logs 
  FOR SELECT 
  USING (public.has_role(auth.uid(), 'admin'));

-- Ensure indexes exist for performance
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON public.users(status);
CREATE INDEX IF NOT EXISTS idx_affiliate_specs_user_id ON public.affiliate_specs(user_id);
CREATE INDEX IF NOT EXISTS idx_operator_specs_user_id ON public.operator_specs(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_reviewer_target ON public.reviews(reviewer_id, target_id);
CREATE INDEX IF NOT EXISTS idx_credits_user_id ON public.credits(user_id);
CREATE INDEX IF NOT EXISTS idx_reveal_logs_revealer_target ON public.reveal_logs(revealer_id, target_id);
