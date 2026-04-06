import { getSupabaseClient } from '../lib/supabase.js';

export const diagnosticTest = async (req, res) => {
  try {
    const token = req.token;
    const user = req.user;
    const supabase = getSupabaseClient(token);

    console.log('DIAGNOSTIC: Testing with UID:', user.id);
    
    const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    
    res.json({
      uid: user.id,
      token_preview: token ? `${token.substring(0, 10)}...` : 'NONE',
      supabase_url: process.env.SUPABASE_URL,
      profile_data: data || 'NULL',
      profile_error: error || 'NONE'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
