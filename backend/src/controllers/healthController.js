import { getSupabaseClient } from '../lib/supabase.js';

export const getFinancialHealth = async (req, res) => {
  try {
    const user = req.user;
    const supabase = getSupabaseClient(req.token);

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

    const { data: txs } = await supabase
      .from('transactions')
      .select('amount, type')
      .eq('user_id', user.id);

    let totalIncome = 0;
    let totalExpense = 0;

    txs?.forEach(t => {
      if (t.type === 'income') totalIncome += Number(t.amount);
      else if (t.type === 'expense') totalExpense += Number(t.amount);
    });

    const { data: debts } = await supabase
      .from('debts_loans')
      .select('amount, type, is_paid')
      .eq('user_id', user.id)
      .eq('is_paid', false);

    const unpaidDebts = debts
      ?.filter(d => d.type === 'debt')
      .reduce((sum, d) => sum + Number(d.amount), 0) || 0;

    const { data: budgets } = await supabase
      .from('budgets')
      .select('id')
      .eq('user_id', user.id);

    let score = 70;

    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0;
    if (savingsRate > 20) score += 15;
    else if (savingsRate > 0) score += 5;
    else score -= 10;

    if (unpaidDebts > totalIncome * 2) score -= 20;
    else if (unpaidDebts > 0) score -= 5;
    else score += 10;

    if (budgets && budgets.length > 0) score += 5;

    let status = 'Sehat';
    let recommendation = 'Pertahankan kebiasaan menabung Anda!';
    
    if (score < 40) {
      status = 'Kritis';
      recommendation = 'Segera kurangi pengeluaran dan lunasi hutang.';
    } else if (score < 70) {
      status = 'Waspada';
      recommendation = 'Coba sisihkan lebih banyak untuk dana darurat.';
    }

    res.json({
      status: 'success',
      data: {
        score: Math.min(100, Math.max(0, score)),
        status,
        recommendation,
        metrics: {
          savingsRate: Math.round(savingsRate),
          unpaidDebts,
          totalIncome,
          totalExpense
        }
      }
    });

  } catch (error) {
    console.error('Health Score Error:', error);
    res.status(500).json({ status: 'error', message: error.message, code: error.code });
  }
};
