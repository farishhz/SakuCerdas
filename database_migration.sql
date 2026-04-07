-- 1. Create Wallets Table
CREATE TABLE wallets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('cash', 'bank', 'ewallet')) DEFAULT 'cash',
  balance NUMERIC DEFAULT 0,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Add Wallet ID to Transactions
ALTER TABLE transactions ADD COLUMN wallet_id UUID REFERENCES wallets(id) ON DELETE SET NULL;

-- 3. RLS for Wallets
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own wallets" ON wallets
  FOR ALL USING (auth.uid() = user_id);

-- 4. Initial Wallet for existing users (Optional)
-- INSERT INTO wallets (user_id, name, type, is_default, balance)
-- SELECT id, 'Dompet Utama', 'cash', true, 0 FROM profiles;

-- 5. RPC to get Total Balance (Aggregated)
CREATE OR REPLACE FUNCTION get_total_balance(target_user_id UUID)
RETURNS NUMERIC AS $$
  SELECT COALESCE(SUM(balance), 0) FROM wallets WHERE user_id = target_user_id;
$$ LANGUAGE sql SECURITY DEFINER;
