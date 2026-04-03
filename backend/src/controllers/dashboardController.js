import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// GET /api/dashboard
export const getDashboardSummary = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) return res.status(401).json({ error: 'Unauthorized' });

    // ambil nama depan user
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', user.id)
      .single();
    const userName = profile?.full_name ? profile.full_name.split(' ')[0] : 'User';

    // ambil dan hitung total pemasukan, pengeluaran, saldo
    const { data: txs } = await supabase
      .from('transactions')
      .select('amount, type')
      .eq('user_id', user.id);
      
    let totalIncome = 0, totalExpense = 0, balance = 0;
    txs?.forEach(t => {
      if (t.type === 'income') { totalIncome += t.amount; balance += t.amount; }
      else if (t.type === 'expense') { totalExpense += t.amount; balance -= t.amount; }
    });

    // ambil data target impian dan progresnya
    const { data: targets } = await supabase
      .from('targets')
      .select('*')
      .eq('user_id', user.id);
    const sortedTargets = (targets || []).sort((a, b) => {
      return (b.current_amount / b.target_amount) - (a.current_amount / a.target_amount);
    });

    // ambil data streak
    const { data: streakData } = await supabase
      .from('saving_streaks')
      .select('current_streak')
      .eq('user_id', user.id)
      .maybeSingle();

    // 5. hitung alert budget kalau pengeluaran bulan ini sudah mendekati limit budget
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
      .gte('created_at', startOfMonth);

    const budgetAlerts = (budgets || []).map(b => {
      const spent = expensesThisMonth
        ?.filter(e => e.category_id === b.category_id)
        .reduce((sum, e) => sum + e.amount, 0) || 0;
      return { ...b, spent, pct: Math.round((spent / b.limit_amount) * 100) };
    }).filter(b => b.pct >= 80);

    // kirim semua data json ke frontend
    res.json({
      status: 'success',
      data: {
        userName,
        summary: { totalIncome, totalExpense, balance },
        targets: sortedTargets,
        streak: streakData?.current_streak || 0,
        budgetAlerts
      }
    });

  } catch (error) {
    res.status(500).json({ error: 'Gagal memuat dashboard' });
  }
};

// POST /api/targets/deposit
export const depositTarget = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const { data: { user } } = await supabase.auth.getUser(token);
    const { targetId, amount, description } = req.body;

    // post ke tabel transaksi
    await supabase.from('transactions').insert([{
      user_id: user.id, target_id: targetId, amount, description, type: 'saving'
    }]);

    // tambah saldo ke target impian
    const { data: targetData } = await supabase.from('targets').select('current_amount').eq('id', targetId).single();
    await supabase.from('targets').update({ current_amount: targetData.current_amount + amount }).eq('id', targetId);

    // update streak nabung
    const { data: streakData } = await supabase.from('saving_streaks').select('*').eq('user_id', user.id).maybeSingle();
    let newStreak = (streakData?.current_streak || 0) + 1;
    

    res.json({
      status: 'success',
      message: 'Berhasil nabung kilat!',
      streakResult: { incremented: true, newStreak }
    });

  } catch (error) {
    res.status(500).json({ error: 'Gagal melakukan transaksi nabung kilat' });
  }
};