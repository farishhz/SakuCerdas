import { getSupabaseClient } from '../lib/supabase.js';
import { addXP, updateStreak, awardBadge } from '../utils/sideEffects.js';

export const getTargets = async (req, res) => {
  try {
    const user = req.user;
    const supabase = getSupabaseClient(req.token);
    const { data, error } = await supabase.from('targets').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
    if (error) throw error;
    res.json({ status: 'success', data });
  } catch (error) {
    console.error('Fetch targets error:', error);
    res.status(500).json({ status: 'error', message: error.message, code: error.code });
  }
};

export const createTarget = async (req, res) => {
  try {
    const user = req.user;
    const supabase = getSupabaseClient(req.token);
    const { name, target_amount, deadline } = req.body;
    const { data, error } = await supabase.from('targets').insert({ user_id: user.id, name, target_amount: Number(target_amount), current_amount: 0, deadline, is_completed: false }).select().single();
    if (error) throw error;
    await addXP(user.id, req.token, 15);
    res.json({ status: 'success', data });
  } catch (error) {
    console.error('Create target error:', error);
    res.status(500).json({ status: 'error', message: error.message, code: error.code });
  }
};

export const depositTarget = async (req, res) => {
  try {
    const user = req.user;
    const supabase = getSupabaseClient(req.token);
    const { targetId, amount, note } = req.body;
    const { data: targetData } = await supabase.from('targets').select('name, current_amount, target_amount').eq('id', targetId).single();
    if (!targetData) return res.status(404).json({ error: 'Target tidak ditemukan' });
    const { data: categories } = await supabase.from('categories').select('id').eq('name', 'Tabungan').eq('type', 'expense').single();
    await supabase.from('transactions').insert([{ user_id: user.id, amount, description: `Nabung: ${targetData.name}${note ? ` (${note})` : ''}`, type: 'expense', category_id: categories?.id, date: new Date().toISOString().split('T')[0] }]);
    await supabase.from('target_deposits').insert({ target_id: targetId, user_id: user.id, amount, note: note ?? `Nabung untuk ${targetData.name}` });
    const newAmount = (targetData.current_amount ?? 0) + Number(amount);
    const isCompleted = newAmount >= (targetData.target_amount ?? 0);
    const { data, error } = await supabase.from('targets').update({ current_amount: newAmount, is_completed: isCompleted, updated_at: new Date().toISOString() }).eq('id', targetId).select().single();
    if (error) throw error;
    await addXP(user.id, req.token, 10);
    await awardBadge(user.id, req.token, 'FIRST_TARGET_DEPOSIT');
    const streakResult = await updateStreak(user.id, req.token);
    res.json({ status: 'success', data, streakResult });
  } catch (error) {
    console.error('Deposit target error:', error);
    res.status(500).json({ status: 'error', message: error.message, code: error.code });
  }
};

export const deleteTarget = async (req, res) => {
  try {
    const user = req.user;
    const supabase = getSupabaseClient(req.token);
    const { id } = req.params;
    const { error } = await supabase.from('targets').delete().eq('id', id).eq('user_id', user.id);
    if (error) throw error;
    res.json({ status: 'success', message: 'Target berhasil dihapus' });
  } catch (error) {
    console.error('Delete target error:', error);
    res.status(500).json({ status: 'error', message: error.message, code: error.code });
  }
};
