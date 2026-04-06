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
    const { type, amount, category_id, description, date } = req.body;
    const { data, error } = await supabase.from('transactions').insert({ user_id: user.id, type, amount: Number(amount), category_id, description, date: date || new Date().toISOString().split('T')[0] }).select().single();
    if (error) throw error;
    await addXP(user.id, req.token, 5);
    const { count } = await supabase.from('transactions').select('*', { count: 'exact', head: true }).eq('user_id', user.id);
    if (count && count >= 10) await awardBadge(user.id, req.token, '10_TRANSACTION');
    const streakResult = await updateStreak(user.id, req.token);
    res.json({ status: 'success', data, streakResult });
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
    const { error } = await supabase.from('transactions').delete().eq('id', id).eq('user_id', user.id);
    if (error) throw error;
    res.json({ status: 'success', message: 'Transaksi berhasil dihapus' });
  } catch (error) {
    console.error('Delete transaction error:', error);
    res.status(500).json({ status: 'error', message: error.message, code: error.code });
  }
};
