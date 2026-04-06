import { getSupabaseClient } from '../lib/supabase.js';

export const getCategories = async (req, res) => {
  try {
    const { token } = req;
    const supabase = getSupabaseClient(token);
    const { data, error } = await supabase.from('categories').select('*').order('name', { ascending: true });
    if (error) throw error;
    res.json({ status: 'success', data });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message, code: error.code });
  }
};
