import { getSupabaseClient } from '../lib/supabase.js';

export const getProfile = async (req, res) => {
  try {
    const { user, token } = req;
    const supabase = getSupabaseClient(token);
    const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    if (error) throw error;
    res.json({ status: 'success', data: { ...data, email: user.email } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message, code: error.code });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { user, token, body: { fullName, phone } } = req;
    const supabase = getSupabaseClient(token);
    const { error } = await supabase.from('profiles').update({ full_name: fullName, phone, updated_at: new Date().toISOString() }).eq('id', user.id);
    if (error) throw error;
    res.json({ status: 'success', message: 'Profil diperbarui' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message, code: error.code });
  }
};

export const getBadges = async (req, res) => {
  try {
    const { user, token } = req;
    const supabase = getSupabaseClient(token);
    const [allBadges, userBadges] = await Promise.all([
      supabase.from('badges').select('*').order('created_at', { ascending: true }),
      supabase.from('user_badges').select('badge_id').eq('user_id', user.id)
    ]);
    const earnedIds = new Set(userBadges.data?.map(b => b.badge_id) || []);
    const mappedBadges = (allBadges.data || []).map(b => ({ ...b, earned: earnedIds.has(b.id) }));
    res.json({ status: 'success', data: mappedBadges });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message, code: error.code });
  }
};

export const getActivityLogs = async (req, res) => {
  try {
    const { user, token, query: { limit = 5 } } = req;
    const supabase = getSupabaseClient(token);
    const { data, error } = await supabase.from('activity_logs').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(parseInt(limit));
    if (error) throw error;
    res.json({ status: 'success', data });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message, code: error.code });
  }
};
