
-- Phase 1: Enable Row Level Security on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_specs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.operator_specs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reveal_logs ENABLE ROW LEVEL SECURITY;

-- Create security definer function to safely check user roles
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT role::text FROM public.users WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Create function to check if user has specific role
CREATE OR REPLACE FUNCTION public.has_role(_role TEXT)
RETURNS BOOLEAN AS $$
  SELECT public.get_current_user_role() = _role;
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
    (OLD.role = NEW.role OR public.has_role('admin'))
  );

CREATE POLICY "Admins can view all users" 
  ON public.users 
  FOR SELECT 
  USING (public.has_role('admin'));

CREATE POLICY "Admins can update all users" 
  ON public.users 
  FOR UPDATE 
  USING (public.has_role('admin'));

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
  USING (public.has_role('admin'));

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
  USING (public.has_role('admin'));

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
  USING (public.has_role('admin'));

-- Add input validation constraints
ALTER TABLE public.users 
ADD CONSTRAINT email_format_check 
CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

ALTER TABLE public.users 
ADD CONSTRAINT display_name_length_check 
CHECK (char_length(display_name) >= 1 AND char_length(display_name) <= 100);

ALTER TABLE public.users 
ADD CONSTRAINT phone_format_check 
CHECK (phone ~ '^[\+]?[0-9\s\-\(\)]{10,20}$');

-- Add rating constraints
ALTER TABLE public.reviews 
ADD CONSTRAINT rating_range_check 
CHECK (rating >= 1 AND rating <= 5);

-- Add comment length constraint
ALTER TABLE public.reviews 
ADD CONSTRAINT comment_length_check 
CHECK (char_length(comment) <= 1000);

-- Prevent self-reviews
ALTER TABLE public.reviews 
ADD CONSTRAINT no_self_review_check 
CHECK (reviewer_id != target_id);

-- Add credit balance constraints
ALTER TABLE public.credits 
ADD CONSTRAINT positive_balance_check 
CHECK (balance_after >= 0);

-- Create indexes for better performance on security queries
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON public.users(status);
CREATE INDEX IF NOT EXISTS idx_affiliate_specs_user_id ON public.affiliate_specs(user_id);
CREATE INDEX IF NOT EXISTS idx_operator_specs_user_id ON public.operator_specs(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_reviewer_target ON public.reviews(reviewer_id, target_id);
CREATE INDEX IF NOT EXISTS idx_credits_user_id ON public.credits(user_id);
CREATE INDEX IF NOT EXISTS idx_reveal_logs_revealer_target ON public.reveal_logs(revealer_id, target_id);
