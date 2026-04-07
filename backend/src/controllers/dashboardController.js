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

    // Get all-time transactions for historical sync and current month stats
    const { data: txs } = await supabase
      .from('transactions')
      .select('amount, type, date')
      .eq('user_id', user.id);

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    
    let totalIncomeMonth = 0, totalExpenseMonth = 0;
    let allTimeNet = 0;

    txs?.forEach(t => {
      const isCurrentMonth = t.date >= startOfMonth;
      const amt = Number(t.amount);
      if (t.type === 'income') {
        allTimeNet += amt;
        if (isCurrentMonth) totalIncomeMonth += amt;
      } else {
        allTimeNet -= amt;
        if (isCurrentMonth) totalExpenseMonth += amt;
      }
    });

    // Get wallets and total balance
    let { data: wallets } = await supabase
      .from('wallets')
      .select('*')
      .eq('user_id', user.id);

    // Auto-create default wallet if none exist (Sync with history)
    if (!wallets || wallets.length === 0) {
      const { data: newWallet } = await supabase.from('wallets').insert({
        user_id: user.id,
        name: 'Dompet Utama',
        type: 'cash',
        balance: allTimeNet, // Initial Sync
        is_default: true
      }).select().single();
      wallets = [newWallet];
      
      // Link all previous null transactions to this new wallet
      await supabase.from('transactions').update({ wallet_id: newWallet.id }).eq('user_id', user.id).is('wallet_id', null);
    } else {
      // Check for transactions without wallet_id (Historical Sync for existing wallets)
      const { data: orphanTxs } = await supabase.from('transactions').select('amount, type').eq('user_id', user.id).is('wallet_id', null);
      if (orphanTxs?.length > 0) {
        let orphanNet = 0;
        orphanTxs.forEach(t => {
          if (t.type === 'income') orphanNet += Number(t.amount);
          else orphanNet -= Number(t.amount);
        });
        
        const defaultWallet = wallets.find(w => w.is_default) || wallets[0];
        await supabase.from('wallets').update({ balance: Number(defaultWallet.balance) + orphanNet }).eq('id', defaultWallet.id);
        await supabase.from('transactions').update({ wallet_id: defaultWallet.id }).eq('user_id', user.id).is('wallet_id', null);
        
        // Refresh wallet data for the response
        const { data: updatedWallets } = await supabase.from('wallets').select('*').eq('user_id', user.id);
        wallets = updatedWallets;
      }
    }

    const totalBalance = wallets.reduce((sum, w) => sum + Number(w.balance), 0);
    const balance = totalBalance;
    const totalIncome = totalIncomeMonth; // Dashboard Card: Monthly only
    const totalExpense = totalExpenseMonth; // Dashboard Card: Monthly only

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
        wallets,
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
      .select('name, current_amount, target_amount')
      .eq('id', targetId)
      .single();

    if (!targetData) return res.status(404).json({ error: 'Target tidak ditemukan' });

    const current = Number(targetData.current_amount);
    const target = Number(targetData.target_amount);
    const deposit = Number(amount);

    if (current + deposit > target) {
      return res.status(400).json({ 
        status: 'error', 
        message: `Tabungan melebihi target! Sisa yang dibutuhkan hanya Rp${(target - current).toLocaleString('id-ID')}.` 
      });
    }

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