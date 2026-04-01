import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY harus diisi di file .env'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ── Type helpers ──────────────────────────────────────────────
export type Profile = {
  id: string;
  full_name: string;
  phone: string | null;
  avatar_url: string | null;
  xp: number;
  level: string;
  created_at: string;
  updated_at: string;
};

export type Category = {
  id: string;
  user_id: string | null;
  name: string;
  type: 'income' | 'expense';
  icon: string | null;
  color: string | null;
  created_at: string;
};

export type Transaction = {
  id: string;
  user_id: string;
  type: 'income' | 'expense';
  amount: number;
  category_id: string | null;
  description: string | null;
  date: string;
  created_at: string;
  updated_at: string;
  categories?: Category;
};

export type Target = {
  id: string;
  user_id: string;
  name: string;
  target_amount: number;
  current_amount: number;
  deadline: string | null;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
};

export type TargetDeposit = {
  id: string;
  target_id: string;
  user_id: string;
  amount: number;
  note: string | null;
  created_at: string;
};

export type Budget = {
  id: string;
  user_id: string;
  category_id: string;
  limit_amount: number;
  period: 'monthly' | 'weekly';
  month: number | null;
  year: number | null;
  created_at: string;
  updated_at: string;
  categories?: Category;
};

export type EmergencyFund = {
  id: string;
  user_id: string;
  marital_status: 'single' | 'married';
  dependants: number;
  monthly_expenses: number;
  multiplier: number;
  target_amount: number;
  created_at: string;
  updated_at: string;
};

export type SavingStreak = {
  id: string;
  user_id: string;
  current_streak: number;
  longest_streak: number;
  last_activity_date: string | null;
};

export type Badge = {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  condition_type: string;
  condition_value: number | null;
};

export type UserBadge = {
  id: string;
  user_id: string;
  badge_id: string;
  earned_at: string;
  badges?: Badge;
};

export type ActivityLog = {
  id: string;
  user_id: string;
  device: string | null;
  ip_address: string | null;
  location: string | null;
  created_at: string;
};
