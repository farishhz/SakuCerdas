import { getSupabaseClient } from '../lib/supabase.js';
import { addXP, updateStreak, awardBadge } from '../utils/sideEffects.js';

export const getTransactions = async (req, res) => {
  try {
    const user = req.user;
    const supabase = getSupabaseClient(req.token);
    const { month, year, type } = req.query;
    let query = supabase.from('transactions').select('*, categories(name, icon, type)').eq('user_id', user.id).order('date', { ascending: false });
    if (type) query = query.eq('type', type);
    const { data, error } = await query;
    if (error) throw error;
    res.json({ status: 'success', data });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ status: 'error', message: error.message, code: error.code });
  }
};

export const createTransaction = async (req, res) => {
  try {
    const user = req.user;
    const supabase = getSupabaseClient(req.token);
    const { type, amount, category_id, description, date, wallet_id } = req.body;
    
    // Fallback to default wallet if none provided
    let targetWalletId = wallet_id;
    if (!targetWalletId) {
      const { data: defWallet } = await supabase.from('wallets').select('id').eq('user_id', user.id).eq('is_default', true).maybeSingle();
      targetWalletId = defWallet?.id;
    }

    if (!targetWalletId) {
      const { data: firstWallet } = await supabase.from('wallets').select('id').eq('user_id', user.id).limit(1).maybeSingle();
      targetWalletId = firstWallet?.id;
    }

    const { data: tx, error } = await supabase.from('transactions').insert({ 
      user_id: user.id, type, amount: Number(amount), category_id, description, wallet_id: targetWalletId,
      date: date || new Date().toISOString().split('T')[0] 
    }).select().single();
    
    if (error) throw error;

    // Update Wallet Balance (Denormalization for performance)
    const { data: walletData } = await supabase.from('wallets').select('balance').eq('id', targetWalletId).single();
    const multiplier = type === 'income' ? 1 : -1;
    await supabase.from('wallets').update({ 
      balance: Number(walletData.balance) + (Number(amount) * multiplier)
    }).eq('id', targetWalletId);

    await addXP(user.id, req.token, 5);
    const { count } = await supabase.from('transactions').select('*', { count: 'exact', head: true }).eq('user_id', user.id);
    if (count && count >= 10) await awardBadge(user.id, req.token, '10_TRANSACTION');
    const streakResult = await updateStreak(user.id, req.token);
    res.json({ status: 'success', data: tx, streakResult });
  } catch (error) {
    console.error('Create transaction error:', error);
    res.status(500).json({ status: 'error', message: error.message, code: error.code });
  }
};

export const deleteTransaction = async (req, res) => {
  try {
    const user = req.user;
    const supabase = getSupabaseClient(req.token);
    const { id } = req.params;

    // Get tx info before deleting to revert wallet balance
    const { data: tx } = await supabase.from('transactions').select('*').eq('id', id).eq('user_id', user.id).single();
    if (tx) {
      const { data: w } = await supabase.from('wallets').select('balance').eq('id', tx.wallet_id).single();
      if (w) {
        const revertAmount = tx.type === 'income' ? -tx.amount : tx.amount;
        await supabase.from('wallets').update({ balance: Number(w.balance) + Number(revertAmount) }).eq('id', tx.wallet_id);
      }
    }

    const { error } = await supabase.from('transactions').delete().eq('id', id).eq('user_id', user.id);
    if (error) throw error;
    res.json({ status: 'success', message: 'Transaksi berhasil dihapus' });
  } catch (error) {
    console.error('Delete transaction error:', error);
    res.status(500).json({ status: 'error', message: error.message, code: error.code });
  }
};
