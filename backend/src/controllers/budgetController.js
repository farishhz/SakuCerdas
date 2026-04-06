import { getSupabaseClient } from '../lib/supabase.js';
import { addXP, awardBadge } from '../utils/sideEffects.js';

export const getBudgets = async (req, res) => {
  try {
    const user = req.user;
    const supabase = getSupabaseClient(req.token);
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    
    const { data: budgets, error } = await supabase
      .from('budgets')
      .select('*, categories(name, icon)')
      .eq('user_id', user.id)
      .eq('month', now.getMonth() + 1)
      .eq('year', now.getFullYear());
      
    if (error) throw error;

    const { data: expenses } = await supabase
      .from('transactions')
      .select('category_id, amount')
      .eq('user_id', user.id)
      .eq('type', 'expense')
      .gte('date', startOfMonth);

    const merged = budgets.map(b => {
      const spent = expenses
        ?.filter(e => e.category_id === b.category_id)
        .reduce((sum, e) => sum + Number(e.amount), 0) || 0;
      return { ...b, spent };
    });

    res.json({ status: 'success', data: merged });
  } catch (error) {
    console.error('Get budgets error:', error);
    res.status(500).json({ status: 'error', message: error.message, code: error.code });
  }
};

export const createBudget = async (req, res) => {
  try {
    const user = req.user;
    const supabase = getSupabaseClient(req.token);
    const now = new Date();
    const { category_id, limit_amount } = req.body;
    const { data, error } = await supabase
      .from('budgets')
      .insert({
        user_id: user.id,
        category_id,
        limit_amount: Number(limit_amount),
        period: 'monthly',
        month: now.getMonth() + 1,
        year: now.getFullYear()
      })
      .select()
      .single();
    if (error) throw error;
    await addXP(user.id, req.token, 10);
    const { count } = await supabase.from('budgets').select('*', { count: 'exact', head: true }).eq('user_id', user.id);
    if (count && count >= 3) await awardBadge(user.id, req.token, 'BUDGET_MASTER');
    res.json({ status: 'success', data });
  } catch (error) {
    console.error('Create budget error:', error);
    res.status(500).json({ status: 'error', message: error.message, code: error.code });
  }
};

export const deleteBudget = async (req, res) => {
  try {
    const user = req.user;
    const supabase = getSupabaseClient(req.token);
    const { id } = req.params;
    const { error } = await supabase.from('budgets').delete().eq('id', id).eq('user_id', user.id);
    if (error) throw error;
    res.json({ status: 'success', message: 'Anggaran berhasil dihapus' });
  } catch (error) {
    console.error('Delete budget error:', error);
    res.status(500).json({ status: 'error', message: error.message, code: error.code });
  }
};
