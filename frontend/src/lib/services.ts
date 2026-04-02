import { supabase } from '../lib/supabase';



export const authService = {
  
  async register(email: string, password: string, fullName: string, phone?: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, phone },
      },
    });
    if (error) throw error;
    
    
    if (data.user && phone) {
      const userId = data.user.id;
      setTimeout(async () => {
        await supabase.from('profiles').update({ phone }).eq('id', userId);
      }, 1500); 
    }

    setTimeout(async () => {
      await profileService.awardBadge('REGISTER');
    }, 2000);

    return data;
  },

  async login(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;

    if (data.user) {
      await supabase.from('activity_logs').insert({
        user_id: data.user.id,
        device: navigator.userAgent.includes('Mobile') ? 'Mobile Browser' : 'Desktop Browser',
        ip_address: null, // bisa diisi dari API eksternal jika perlu
      });
    }

    return data;
  },

  async loginWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });
    if (error) throw error;
    return data;
  },

  async logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getCurrentUser() {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return data.user;
  },

  async deleteAccount() {
    const { error } = await supabase.rpc('delete_current_user');
    if (error) throw error;
    await supabase.auth.signOut();
  },
};



export const profileService = {
  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (error) throw error;
    return data;
  },

  async updateProfile(userId: string, updates: { full_name?: string; phone?: string; avatar_url?: string }) {
    const { data, error } = await supabase
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async addXP(amount: number) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: profile } = await supabase.from('profiles').select('xp, level').eq('id', user.id).single();
      if (!profile) return;

      const newXP = (profile.xp || 0) + amount;
      let newLevel = 'Newbie';
      if (newXP >= 100) newLevel = 'Hemat Ranger';
      if (newXP >= 300) newLevel = 'Master Cuan';
      if (newXP >= 600) newLevel = 'Sultan';

      await supabase.from('profiles').update({ xp: newXP, level: newLevel }).eq('id', user.id);
    } catch(err) {
      console.error('Failed to add XP', err);
    }
  },

  async awardBadge(condition: string) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: badge } = await supabase.from('badges').select('id').eq('condition', condition).single();
      if (!badge) return;

      const { data: existing } = await supabase.from('user_badges').select('id').eq('user_id', user.id).eq('badge_id', badge.id).maybeSingle();
      if (!existing) {
        await supabase.from('user_badges').insert({ user_id: user.id, badge_id: badge.id });
      }
    } catch (err) {
      console.error('Failed to award badge', err);
    }
  }
};


export const targetService = {
  async getAll() {
    const { data, error } = await supabase
      .from('targets')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async create(payload: { name: string; target_amount: number; deadline?: string }) {
    const user = await authService.getCurrentUser();
    const { data, error } = await supabase
      .from('targets')
      .insert({ ...payload, user_id: user!.id })
      .select()
      .single();
    if (error) throw error;
    await profileService.addXP(15);
    return data;
  },

  async deposit(targetId: string, amount: number, note?: string) {
    const user = await authService.getCurrentUser();
    if (!user) throw new Error('User tidak ditemukan');

    const summary = await transactionService.getSummary();
    if (amount > summary.balance) {
      throw new Error(`Saldo tidak cukup! Saldo Anda Rp${summary.balance.toLocaleString('id-ID')}, sedangkan Anda ingin menabung Rp${amount.toLocaleString('id-ID')}.`);
    }

    const { data: target } = await supabase
      .from('targets')
      .select('name, current_amount, target_amount')
      .eq('id', targetId)
      .single();

    if (!target) throw new Error('Target tidak ditemukan');

    const { data: categories } = await supabase
      .from('categories')
      .select('id')
      .eq('name', 'Tabungan')
      .eq('type', 'expense')
      .single();

    await transactionService.create({
      type: 'expense',
      amount: amount,
      category_id: categories?.id,
      description: `Nabung: ${target.name}${note ? ` (${note})` : ''}`,
      date: new Date().toISOString().split('T')[0]
    });

    await supabase.from('target_deposits').insert({
      target_id: targetId,
      user_id: user.id,
      amount,
      note: note ?? `Nabung untuk ${target.name}`,
    });

    const newAmount = (target.current_amount ?? 0) + amount;
    const isCompleted = newAmount >= (target.target_amount ?? 0);

    const { data, error } = await supabase
      .from('targets')
      .update({
        current_amount: newAmount,
        is_completed: isCompleted,
        updated_at: new Date().toISOString(),
      })
      .eq('id', targetId)
      .select()
      .single();

    if (error) throw error;
    await profileService.addXP(10);
    await profileService.awardBadge('FIRST_TARGET_DEPOSIT');
    return data;
  },

  async delete(targetId: string) {
    const { error } = await supabase.from('targets').delete().eq('id', targetId);
    if (error) throw error;
  },
};


export const transactionService = {
  async getAll(filters?: { month?: number; year?: number; type?: 'income' | 'expense' }) {
    let query = supabase
      .from('transactions')
      .select('*, categories(name, icon, type)')
      .order('date', { ascending: false });

    if (filters?.type) query = query.eq('type', filters.type);

    if (filters?.month && filters?.year) {
      const start = `${filters.year}-${String(filters.month).padStart(2, '0')}-01T00:00:00.000Z`;
      const lastDay = new Date(filters.year, filters.month, 0).getDate();
      const end = `${filters.year}-${String(filters.month).padStart(2, '0')}-${lastDay}T23:59:59.999Z`;
      query = query.gte('date', start).lte('date', end);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async create(payload: {
    type: 'income' | 'expense';
    amount: number;
    category_id?: string;
    description?: string;
    date?: string;
  }) {
    const user = await authService.getCurrentUser();
    const { data, error } = await supabase
      .from('transactions')
      .insert({ ...payload, user_id: user!.id, date: payload.date ?? new Date().toISOString().split('T')[0] })
      .select()
      .single();
    if (error) throw error;

    await profileService.addXP(5);
    const { count } = await supabase.from('transactions').select('*', { count: 'exact', head: true }).eq('user_id', user!.id);
    if (count && count >= 10) await profileService.awardBadge('10_TRANSACTION');

    return data;
  },

  async delete(transactionId: string) {
    const { error } = await supabase.from('transactions').delete().eq('id', transactionId);
    if (error) throw error;
  },

  async getSummary() {
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    const [income, expense] = await Promise.all([
      transactionService.getAll({ month, year, type: 'income' }),
      transactionService.getAll({ month, year, type: 'expense' }),
    ]);

    const totalIncome = income?.reduce((sum, t) => sum + t.amount, 0) ?? 0;
    const totalExpense = expense?.reduce((sum, t) => sum + t.amount, 0) ?? 0;
    return { totalIncome, totalExpense, balance: totalIncome - totalExpense };
  },
};


export const budgetService = {
  async getAll() {
    const now = new Date();
    const { data, error } = await supabase
      .from('budgets')
      .select('*, categories(name, icon)')
      .eq('month', now.getMonth() + 1)
      .eq('year', now.getFullYear());
    if (error) throw error;
    return data;
  },

  async create(payload: { category_id: string; limit_amount: number }) {
    const now = new Date();
    const user = await authService.getCurrentUser();
    const { data, error } = await supabase
      .from('budgets')
      .insert({
        ...payload,
        user_id: user!.id,
        period: 'monthly',
        month: now.getMonth() + 1,
        year: now.getFullYear(),
      })
      .select()
      .single();
    if (error) throw error;

    await profileService.addXP(10);
    const { count } = await supabase.from('budgets').select('*', { count: 'exact', head: true }).eq('user_id', user!.id);
    if (count && count >= 3) await profileService.awardBadge('BUDGET_MASTER');

    return data;
  },

  async delete(budgetId: string) {
    const { error } = await supabase.from('budgets').delete().eq('id', budgetId);
    if (error) throw error;
  },
};


export const categoryService = {
  async getAll(type?: 'income' | 'expense') {
    let query = supabase.from('categories').select('*').order('name');
    if (type) query = query.eq('type', type);
    const { data, error } = await query;
    if (error) throw error;
    return data;
  },
};


export const emergencyFundService = {
  async get() {
    const { data, error } = await supabase
      .from('emergency_fund')
      .select('*')
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async save(payload: {
    marital_status: 'single' | 'married';
    dependants: number;
    monthly_expenses: number;
    multiplier: number;
    target_amount: number;
  }) {
    const user = await authService.getCurrentUser();
    const { data, error } = await supabase
      .from('emergency_fund')
      .upsert({ ...payload, user_id: user!.id, updated_at: new Date().toISOString() })
      .select()
      .single();
    if (error) throw error;
    return data;
  },
};


export const badgeService = {
  async getMine() {
    const { data, error } = await supabase
      .from('user_badges')
      .select('*, badges(name, description, icon)')
      .order('earned_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async getAllMaster() {
    const { data, error } = await supabase.from('badges').select('*');
    if (error) throw error;
    return data;
  },
};


export const activityLogService = {
  async getRecent(limit = 5) {
    const { data, error } = await supabase
      .from('activity_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data;
  },
};
