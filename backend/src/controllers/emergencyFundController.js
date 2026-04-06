import { getSupabaseClient } from '../lib/supabase.js';
import { addXP } from '../utils/sideEffects.js';

export const getEmergencyFund = async (req, res) => {
  try {
    const { user, token } = req;
    const supabase = getSupabaseClient(token);
    const { data, error } = await supabase.from('emergency_funds').select('*').eq('user_id', user.id).maybeSingle();
    if (error) throw error;
    res.json({ status: 'success', data });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message, code: error.code });
  }
};

export const saveEmergencyFund = async (req, res) => {
  try {
    const { user, token, body: payload } = req;
    const supabase = getSupabaseClient(token);
    const { data, error } = await supabase.from('emergency_funds').upsert({ user_id: user.id, target_amount: Number(payload.target_amount), current_amount: Number(payload.current_amount || 0), updated_at: new Date().toISOString() }).select().single();
    if (error) throw error;
    await addXP(user.id, token, 10);
    res.json({ status: 'success', data });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message, code: error.code });
  }
};
