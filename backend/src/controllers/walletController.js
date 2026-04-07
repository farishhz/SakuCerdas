import { getSupabaseClient } from '../lib/supabase.js';

export const getWallets = async (req, res) => {
  try {
    const { token, user } = req;
    const supabase = getSupabaseClient(token);
    const { data, error } = await supabase.from('wallets').select('*').eq('user_id', user.id).order('is_default', { ascending: false });
    if (error) throw error;
    res.json({ status: 'success', data });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const createWallet = async (req, res) => {
  try {
    const { token, user, body: { name, type, is_default, balance = 0 } } = req;
    const supabase = getSupabaseClient(token);
    
    // If setting as default, unset others first
    if (is_default) {
      await supabase.from('wallets').update({ is_default: false }).eq('user_id', user.id);
    }

    const { data, error } = await supabase.from('wallets').insert({
      user_id: user.id,
      name,
      type,
      is_default,
      balance: Number(balance)
    }).select().single();
    
    if (error) throw error;
    res.json({ status: 'success', data });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const deleteWallet = async (req, res) => {
  try {
    const { token, user, params: { id } } = req;
    const supabase = getSupabaseClient(token);
    const { error } = await supabase.from('wallets').delete().eq('id', id).eq('user_id', user.id);
    if (error) throw error;
    res.json({ status: 'success', message: 'Dompet dihapus' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
