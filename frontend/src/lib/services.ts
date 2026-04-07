import { supabase } from '../lib/supabase';

const API_BASE_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:8000/api';

const getHeaders = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${session?.access_token || ''}`
  };
};

export const bffService = {
  async getDashboardSummary() {
    const res = await fetch(`${API_BASE_URL}/dashboard`, { headers: await getHeaders() });
    if (!res.ok) throw new Error('Gagal mengambil ringkasan dashboard');
    return res.json();
  },

  async getFinancialHealth() {
    const res = await fetch(`${API_BASE_URL}/financial-health`, { headers: await getHeaders() });
    if (!res.ok) throw new Error('Gagal menghitung skor kesehatan');
    return res.json();
  },

  async getTransactions(filters?: { month?: number; year?: number; type?: string }) {
    const params = new URLSearchParams();
    if (filters?.month) params.append('month', filters.month.toString());
    if (filters?.year) params.append('year', filters.year.toString());
    if (filters?.type) params.append('type', filters.type);
    
    const res = await fetch(`${API_BASE_URL}/transactions?${params.toString()}`, { headers: await getHeaders() });
    return res.json();
  },

  async createTransaction(payload: any) {
    const res = await fetch(`${API_BASE_URL}/transactions`, {
      method: 'POST',
      headers: await getHeaders(),
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  async deleteTransaction(id: string) {
    const res = await fetch(`${API_BASE_URL}/transactions/${id}`, {
      method: 'DELETE',
      headers: await getHeaders()
    });
    return res.json();
  },

  async getTargets() {
    const res = await fetch(`${API_BASE_URL}/targets`, { headers: await getHeaders() });
    return res.json();
  },

  async createTarget(payload: any) {
    const res = await fetch(`${API_BASE_URL}/targets`, {
      method: 'POST',
      headers: await getHeaders(),
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  async depositTarget(payload: { targetId: string; amount: number; note?: string }) {
    const res = await fetch(`${API_BASE_URL}/targets/deposit`, {
      method: 'POST',
      headers: await getHeaders(),
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Gagal melakukan nabung kilat');
    return res.json();
  },

  async deleteTarget(id: string) {
    const res = await fetch(`${API_BASE_URL}/targets/${id}`, {
      method: 'DELETE',
      headers: await getHeaders()
    });
    return res.json();
  },

  async getBudgets() {
    const res = await fetch(`${API_BASE_URL}/budgets`, { headers: await getHeaders() });
    return res.json();
  },

  async createBudget(payload: any) {
    const res = await fetch(`${API_BASE_URL}/budgets`, {
      method: 'POST',
      headers: await getHeaders(),
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  async deleteBudget(id: string) {
    const res = await fetch(`${API_BASE_URL}/budgets/${id}`, {
      method: 'DELETE',
      headers: await getHeaders()
    });
    return res.json();
  },

  async getEmergencyFund() {
    const res = await fetch(`${API_BASE_URL}/emergency-fund`, { headers: await getHeaders() });
    return res.json();
  },

  async saveEmergencyFund(payload: any) {
    const res = await fetch(`${API_BASE_URL}/emergency-fund`, {
      method: 'POST',
      headers: await getHeaders(),
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  async getDebts() {
    const res = await fetch(`${API_BASE_URL}/debts`, { headers: await getHeaders() });
    return res.json();
  },

  async createDebt(payload: any) {
    const res = await fetch(`${API_BASE_URL}/debts`, {
      method: 'POST',
      headers: await getHeaders(),
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  async toggleDebtPaid(id: string, isPaid: boolean) {
    const res = await fetch(`${API_BASE_URL}/debts/${id}`, {
      method: 'PATCH',
      headers: await getHeaders(),
      body: JSON.stringify({ isPaid })
    });
    return res.json();
  },

  async deleteDebt(id: string) {
    const res = await fetch(`${API_BASE_URL}/debts/${id}`, {
      method: 'DELETE',
      headers: await getHeaders()
    });
    return res.json();
  },

  async getRecurring() {
    const res = await fetch(`${API_BASE_URL}/recurring`, { headers: await getHeaders() });
    return res.json();
  },

  async createRecurring(payload: any) {
    const res = await fetch(`${API_BASE_URL}/recurring`, {
      method: 'POST',
      headers: await getHeaders(),
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  async toggleRecurringActive(id: string, isActive: boolean) {
    const res = await fetch(`${API_BASE_URL}/recurring/${id}`, {
      method: 'PATCH',
      headers: await getHeaders(),
      body: JSON.stringify({ isActive })
    });
    return res.json();
  },

  async deleteRecurring(id: string) {
    const res = await fetch(`${API_BASE_URL}/recurring/${id}`, {
      method: 'DELETE',
      headers: await getHeaders()
    });
    return res.json();
  },

  async getCategories(type?: string) {
    const query = type ? `?type=${type}` : '';
    const res = await fetch(`${API_BASE_URL}/categories${query}`, { headers: await getHeaders() });
    return res.json();
  },

  async getProfile() {
    const res = await fetch(`${API_BASE_URL}/profile`, { headers: await getHeaders() });
    return res.json();
  },

  async updateProfile(fullName: string, phone?: string) {
    const res = await fetch(`${API_BASE_URL}/profile`, {
      method: 'PATCH',
      headers: await getHeaders(),
      body: JSON.stringify({ fullName, phone })
    });
    return res.json();
  },

  async getBadges() {
    const res = await fetch(`${API_BASE_URL}/badges`, { headers: await getHeaders() });
    return res.json();
  },

  async getWallets() {
    const res = await fetch(`${API_BASE_URL}/wallets`, { headers: await getHeaders() });
    return res.json();
  },

  async createWallet(payload: any) {
    const res = await fetch(`${API_BASE_URL}/wallets`, {
      method: 'POST',
      headers: await getHeaders(),
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  async deleteWallet(id: string) {
    const res = await fetch(`${API_BASE_URL}/wallets/${id}`, {
      method: 'DELETE',
      headers: await getHeaders()
    });
    return res.json();
  },

  async getActivityLogs(limit = 5) {
    const res = await fetch(`${API_BASE_URL}/activity-logs?limit=${limit}`, { headers: await getHeaders() });
    return res.json();
  }
};

export const authService = {
  async register(email: string, password: string, fullName: string, phone?: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, phone },
      },
    });
    if (error) throw error;
    return data;
  },

  async login(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  },

  async loginWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });
    if (error) throw error;
    return data;
  },

  async logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getCurrentUser() {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return data.user;
  },

  async deleteAccount() {
    const { error } = await supabase.rpc('delete_current_user');
    if (error) throw error;
    await supabase.auth.signOut();
  }
};
