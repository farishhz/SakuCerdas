# Panduan Penggunaan & Instalasi - SakuCerdas

Dokumen ini berisi panduan lengkap untuk memasang, mengonfigurasi, dan menjalankan proyek **SakuCerdas** di lingkungan lokal. Panduan ini disusun untuk membantu penguji/reviewer dalam melakukan verifikasi teknis.

---

## Prasyarat (Prerequisites)

Sebelum memulai, pastikan perangkat Anda sudah terinstal:
-   **Node.js** (Versi 18.0.0 atau lebih baru)
-   **npm** (Versi 9.x atau lebih baru)
-   **Akun Supabase** (Untuk Database & Auth)
-   **GNews API Key** (Untuk fitur Literasi Keuangan)

---

## Langkah Instalasi

### 1. Kloning Repositori
```bash
git clone https://github.com/farishhz/SakuCerdas.git
cd SakuCerdas
```

### 2. Instalasi Dependensi Frontend
```bash
cd frontend
npm install
```

---

## Konfigurasi Environment Variable

Buat file `.env` di dalam direktori `frontend/` dan isi dengan variabel berikut:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# GNews API Configuration
VITE_GNEWS_API_KEY=your-gnews-api-key

# App Configuration
VITE_APP_NAME=SakuCerdas
VITE_APP_URL=http://localhost:5173
```

> **Catatan**: 
> - Anda bisa mendapatkan `SUPABASE_URL` dan `ANON_KEY` dari dashboard Supabase di menu **Project Settings > API**.
> - Anda bisa mendapatkan `GNEWS_API_KEY` secara gratis di [gnews.io](https://gnews.io/).

---

## Setup Database (Supabase SQL)

Proyek ini menggunakan Supabase sebagai backend. Untuk menyiapkan database, buka **SQL Editor** di Dashboard Supabase Anda dan jalankan skrip berikut untuk membuat tabel-tabel yang diperlukan:

```sql
-- 1. Tabel Profiles (User Data)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  xp INTEGER DEFAULT 0,
  level TEXT DEFAULT 'Newbie',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tabel Categories (Transaction Categories)
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT,
  type TEXT CHECK (type IN ('income', 'expense'))
);

-- 3. Tabel Transactions
CREATE TABLE transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  type TEXT NOT NULL,
  amount DECIMAL NOT NULL,
  category_id UUID REFERENCES categories(id),
  description TEXT,
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Tabel Targets (Saving Goals)
CREATE TABLE targets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  name TEXT NOT NULL,
  target_amount DECIMAL NOT NULL,
  current_amount DECIMAL DEFAULT 0,
  deadline DATE,
  is_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Tabel Budgets
CREATE TABLE budgets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id),
  limit_amount DECIMAL NOT NULL,
  period TEXT DEFAULT 'monthly',
  month INTEGER,
  year INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Isian Kategori Default 
INSERT INTO categories (name, icon, type) VALUES 
('Gaji', 'Wallet', 'income'),
('Bonus', 'Gift', 'income'),
('Investasi', 'TrendingUp', 'income'),
('Makan & Minum', 'Utensils', 'expense'),
('Transportasi', 'Car', 'expense'),
('Hiburan', 'Film', 'expense'),
('Tabungan', 'PiggyBank', 'expense');
```

---

## Menjalankan Aplikasi

### Mode Pengembangan (Development)
```bash
# Di dalam folder frontend
npm run dev
```
Aplikasi akan berjalan di `http://localhost:5173`.

### Mode Produksi (Build)
```bash
npm run build
npm run preview
```

---

## Deployment (Dukungan Proxy)

Aplikasi ini dilengkapi dengan **Vercel Serverless Function** untuk mengatasi masalah CORS saat memanggil GNews API di server produksi. Konfigurasi ini terletak di folder `frontend/api/` dan akan aktif secara otomatis jika di-deploy ke Vercel.

---

## Troubleshooting

-   **Error: Failed to fetch (GNews)**: Pastikan `VITE_GNEWS_API_KEY` Anda valid. Jika di lokal, pastikan adblocker tidak memblokir request ke `gnews.io`.
-   **Supabase Auth Error**: Pastikan Anda sudah mengaktifkan fitur **Email Auth** di menu **Authentication > Providers** pada dashboard Supabase.

---

© 2026 **SakuCerdas Team** - Future-Ready Work & Economy.
