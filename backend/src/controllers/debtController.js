import { getSupabaseClient } from '../lib/supabase.js';

export const getDebts = async (req, res) => {
  try {
    const { user, token } = req;
    const supabase = getSupabaseClient(token);
    const { data, error } = await supabase.from('debts_loans').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
    if (error) throw error;
    res.json({ status: 'success', data });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message, code: error.code });
  }
};

export const createDebt = async (req, res) => {
  try {
    const { user, token, body: { type, person_name, amount, description, due_date } } = req;
    const supabase = getSupabaseClient(token);
    const { data, error } = await supabase.from('debts_loans').insert({ user_id: user.id, type, person_name, amount: Number(amount), description, due_date, is_paid: false }).select().single();
    if (error) throw error;
    res.json({ status: 'success', data });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message, code: error.code });
  }
};

export const toggleDebtPaid = async (req, res) => {
  try {
    const { user, token, params: { id }, body: { is_paid } } = req;
    const supabase = getSupabaseClient(token);
    const { data, error } = await supabase.from('debts_loans').update({ is_paid }).eq('id', id).eq('user_id', user.id).select().single();
    if (error) throw error;
    res.json({ status: 'success', data });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message, code: error.code });
  }
};

export const deleteDebt = async (req, res) => {
  try {
    const { user, token, params: { id } } = req;
    const supabase = getSupabaseClient(token);
    const { error } = await supabase.from('debts_loans').delete().eq('id', id).eq('user_id', user.id);
    if (error) throw error;
    res.json({ status: 'success', message: 'Hutang berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message, code: error.code });
  }
};
