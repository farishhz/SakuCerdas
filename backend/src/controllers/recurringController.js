import { getSupabaseClient } from '../lib/supabase.js';
import { addXP } from '../utils/sideEffects.js';

export const getRecurring = async (req, res) => {
  try {
    const { user, token } = req;
    const supabase = getSupabaseClient(token);
    const { data, error } = await supabase.from('recurring_transactions').select('*, categories(name, icon)').eq('user_id', user.id).order('created_at', { ascending: false });
    if (error) throw error;
    res.json({ status: 'success', data });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message, code: error.code });
  }
};

export const createRecurring = async (req, res) => {
  try {
    const { user, token, body: { name, amount, interval, next_due_date } } = req;
    const supabase = getSupabaseClient(token);
    const { data, error } = await supabase.from('recurring_transactions').insert({ user_id: user.id, name, amount: Number(amount), interval, next_due_date, is_active: true }).select().single();
    if (error) throw error;
    await addXP(user.id, token, 10);
    res.json({ status: 'success', data });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message, code: error.code });
  }
};

export const toggleRecurringActive = async (req, res) => {
  try {
    const { user, token, params: { id }, body: { isActive } } = req;
    const supabase = getSupabaseClient(token);
    const { data, error } = await supabase.from('recurring_transactions').update({ is_active: isActive, updated_at: new Date().toISOString() }).eq('id', id).eq('user_id', user.id).select().single();
    if (error) throw error;
    res.json({ status: 'success', data });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message, code: error.code });
  }
};

export const deleteRecurring = async (req, res) => {
  try {
    const { user, token, params: { id } } = req;
    const supabase = getSupabaseClient(token);
    const { error } = await supabase.from('recurring_transactions').delete().eq('id', id).eq('user_id', user.id);
    if (error) throw error;
    res.json({ status: 'success', message: 'Transaksi rutin berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message, code: error.code });
  }
};
