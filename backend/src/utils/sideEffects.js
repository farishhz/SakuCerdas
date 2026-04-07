import { getSupabaseClient } from '../lib/supabase.js';

export const addXP = async (userId, token, amount) => {
  try {
    const supabase = getSupabaseClient(token);
    const { data: profile } = await supabase.from('profiles').select('xp, level').eq('id', userId).single();
    if (!profile) return;
    const newXP = (profile.xp || 0) + amount;
    let newLevel = 'Newbie';
    if (newXP >= 100) newLevel = 'Saver Apprentice';
    if (newXP >= 300) newLevel = 'Budget Master';
    if (newXP >= 700) newLevel = 'Wealth Architect';
    if (newXP >= 1500) newLevel = 'Financial Legend';
    await supabase.from('profiles').update({ xp: newXP, level: newLevel }).eq('id', userId);
  } catch (err) {
    console.error('Failed to add XP', err);
  }
};

export const awardBadge = async (userId, token, condition) => {
  try {
    const supabase = getSupabaseClient(token);
    const { data: badge } = await supabase.from('badges').select('id').eq('condition', condition).single();
    if (!badge) return;
    const { data: existing } = await supabase.from('user_badges').select('id').eq('user_id', userId).eq('badge_id', badge.id).maybeSingle();
    if (!existing) {
      await supabase.from('user_badges').insert({ user_id: userId, badge_id: badge.id });
    }
  } catch (err) {
    console.error('Failed to award badge', err);
  }
};

export const updateStreak = async (userId, token) => {
  try {
    const supabase = getSupabaseClient(token);
    const now = new Date();
    const today = now.toLocaleDateString('en-CA');
    const yesterdayDate = new Date(now);
    yesterdayDate.setDate(now.getDate() - 1);
    const yesterday = yesterdayDate.toLocaleDateString('en-CA');
    const { data: streak } = await supabase.from('saving_streaks').select('*').eq('user_id', userId).maybeSingle();
    if (!streak) {
      await supabase.from('saving_streaks').insert({ user_id: userId, current_streak: 1, longest_streak: 1, last_activity_date: today });
      return { incremented: true, newStreak: 1 };
    }
    if (streak.last_activity_date === today) return { incremented: false, newStreak: streak.current_streak };
    if (streak.last_activity_date === yesterday) {
      const newStreak = (streak.current_streak || 0) + 1;
      await supabase.from('saving_streaks').update({ current_streak: newStreak, longest_streak: Math.max(newStreak, streak.longest_streak || 1), last_activity_date: today, updated_at: new Date().toISOString() }).eq('user_id', userId);
      return { incremented: true, newStreak };
    } else {
      await supabase.from('saving_streaks').update({ current_streak: 1, last_activity_date: today, updated_at: new Date().toISOString() }).eq('user_id', userId);
      return { incremented: true, newStreak: 1 };
    }
  } catch (err) {
    console.error('Streak update failed:', err);
    return { incremented: false, newStreak: 0 };
  }
};
