import { getSupabaseClient } from '../lib/supabase.js';

export const getDashboardSummary = async (req, res) => {
  try {
    const user = req.user;
    const supabase = getSupabaseClient(req.token);

    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', user.id)
      .single();
    const userName = profile?.full_name ? profile.full_name.split(' ')[0] : 'User';

    const { data: txs } = await supabase
      .from('transactions')
      .select('amount, type')
      .eq('user_id', user.id);
      
    let totalIncome = 0, totalExpense = 0;
    txs?.forEach(t => {
      if (t.type === 'income') totalIncome += Number(t.amount);
      else if (t.type === 'expense') totalExpense += Number(t.amount);
    });
    const balance = totalIncome - totalExpense;

    const { data: targets } = await supabase
      .from('targets')
      .select('*')
      .eq('user_id', user.id);
    const sortedTargets = (targets || []).sort((a, b) => {
      const pctA = a.current_amount / a.target_amount;
      const pctB = b.current_amount / b.target_amount;
      return pctB - pctA;
    });

    const { data: streakData } = await supabase
      .from('saving_streaks')
      .select('current_streak')
      .eq('user_id', user.id)
      .maybeSingle();

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    
    const { data: budgets } = await supabase
      .from('budgets')
      .select('*, categories(name)')
      .eq('user_id', user.id);
      
    const { data: expensesThisMonth } = await supabase
      .from('transactions')
      .select('category_id, amount')
      .eq('user_id', user.id)
      .eq('type', 'expense')
      .gte('date', startOfMonth);

    const alerts = (budgets || []).map(b => {
      const spent = expensesThisMonth
        ?.filter(e => e.category_id === b.category_id)
        .reduce((sum, e) => sum + Number(e.amount), 0) || 0;
      return { 
        category_name: b.categories?.name || 'Kategori',
        limit: b.limit_amount,
        spent,
        pct: Math.round((spent / b.limit_amount) * 100) 
      };
    }).filter(b => b.pct >= 80);

    res.json({
      status: 'success',
      data: {
        userName,
        summary: { totalIncome, totalExpense, balance },
        targets: sortedTargets,
        streak: streakData?.current_streak || 0,
        budgetAlerts: alerts
      }
    });

  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ status: 'error', message: error.message, code: error.code });
  }
};

export const depositTarget = async (req, res) => {
  try {
    const user = req.user;
    const { targetId, amount, description } = req.body;

    const { data: targetData } = await supabase
      .from('targets')
      .select('name, current_amount')
      .eq('id', targetId)
      .single();

    if (!targetData) return res.status(404).json({ error: 'Target tidak ditemukan' });

    await supabase.from('transactions').insert([{
      user_id: user.id, 
      amount, 
      description: `Nabung Kilat: ${targetData.name}`, 
      type: 'expense',
      date: new Date().toISOString().split('T')[0]
    }]);

    await supabase
      .from('targets')
      .update({ current_amount: Number(targetData.current_amount) + Number(amount) })
      .eq('id', targetId);

    const { data: streakData } = await supabase
      .from('saving_streaks')
      .select('current_streak')
      .eq('user_id', user.id)
      .maybeSingle();
    let newStreak = (streakData?.current_streak || 0) + 1;

    res.json({
      status: 'success',
      message: 'Berhasil nabung kilat!',
      streakResult: { incremented: true, newStreak }
    });

  } catch (error) {
    console.error('Deposit error:', error);
    res.status(500).json({ status: 'error', message: error.message, code: error.code });
  }
};