-- Credits System Migration
-- Enables credit purchases and multi-dashboard creation

-- Create credits table to track user credit balances
CREATE TABLE IF NOT EXISTS public.credits (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  balance INT DEFAULT 0 NOT NULL CHECK (balance >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  -- Ensure one credit record per user
  UNIQUE(user_id)
);

-- Create credit_transactions table to track all credit movements
CREATE TABLE IF NOT EXISTS public.credit_transactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  amount INT NOT NULL, -- Positive for credits added, negative for credits spent
  type TEXT CHECK (type IN ('purchase', 'spend', 'refund', 'bonus')) NOT NULL,
  description TEXT NOT NULL,
  reference_id UUID, -- Can reference order_id for purchases or kit_id for spends
  stripe_payment_intent_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;

-- Credits policies
CREATE POLICY "Users can view their own credits" ON public.credits
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage credits" ON public.credits
  FOR ALL USING (current_setting('role') = 'service_role');

-- Credit transactions policies
CREATE POLICY "Users can view their own transactions" ON public.credit_transactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage transactions" ON public.credit_transactions
  FOR ALL USING (current_setting('role') = 'service_role');

-- Create updated_at trigger for credits
CREATE TRIGGER on_credits_updated
  BEFORE UPDATE ON public.credits
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS credits_user_id_idx ON public.credits(user_id);
CREATE INDEX IF NOT EXISTS credit_transactions_user_id_idx ON public.credit_transactions(user_id);
CREATE INDEX IF NOT EXISTS credit_transactions_created_at_idx ON public.credit_transactions(created_at DESC);

-- Function to add credits to user
CREATE OR REPLACE FUNCTION public.add_credits(
  p_user_id UUID,
  p_amount INT,
  p_type TEXT,
  p_description TEXT,
  p_reference_id UUID DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  -- Insert or update credits balance
  INSERT INTO public.credits (user_id, balance)
  VALUES (p_user_id, p_amount)
  ON CONFLICT (user_id) 
  DO UPDATE SET 
    balance = public.credits.balance + p_amount,
    updated_at = timezone('utc'::text, now());
  
  -- Record transaction
  INSERT INTO public.credit_transactions (user_id, amount, type, description, reference_id)
  VALUES (p_user_id, p_amount, p_type, p_description, p_reference_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to spend credits
CREATE OR REPLACE FUNCTION public.spend_credits(
  p_user_id UUID,
  p_amount INT,
  p_description TEXT,
  p_reference_id UUID DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
  v_current_balance INT;
BEGIN
  -- Get current balance
  SELECT balance INTO v_current_balance
  FROM public.credits
  WHERE user_id = p_user_id;
  
  -- If no credits record exists or insufficient balance, return false
  IF v_current_balance IS NULL OR v_current_balance < p_amount THEN
    RETURN FALSE;
  END IF;
  
  -- Deduct credits
  UPDATE public.credits
  SET 
    balance = balance - p_amount,
    updated_at = timezone('utc'::text, now())
  WHERE user_id = p_user_id;
  
  -- Record transaction (negative amount for spend)
  INSERT INTO public.credit_transactions (user_id, amount, type, description, reference_id)
  VALUES (p_user_id, -p_amount, 'spend', p_description, p_reference_id);
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comments
COMMENT ON TABLE public.credits IS 'Stores user credit balances for purchasing additional dashboards';
COMMENT ON TABLE public.credit_transactions IS 'Audit log of all credit additions and deductions';
COMMENT ON FUNCTION public.add_credits IS 'Safely adds credits to a user account';
COMMENT ON FUNCTION public.spend_credits IS 'Safely spends credits from a user account, returns false if insufficient balance';

