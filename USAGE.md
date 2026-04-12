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

### 2. Instalasi Dependensi (Root)
Proyek ini menggunakan struktur monorepo sederhana. Instal dependensi untuk seluruh layanan dari folder utama:
```bash
npm install
```
Perintah ini akan menginstal paket-paket yang diperlukan untuk `frontend` dan `backend`.

---

## Konfigurasi Environment Variable

Buat file `.env` di dalam direktori `frontend/` dan `backend/` serta isi dengan variabel berikut:

**Frontend (`frontend/.env`):**
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_GNEWS_API_KEY=your-gnews-api-key
VITE_SERVER_URL=http://localhost:8000/api
```

**Backend (`backend/.env`):**
```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key
PORT=8000
```

> **Catatan**: 
> - Anda bisa mendapatkan `SUPABASE_URL` dan `ANON_KEY` dari dashboard Supabase di menu **Project Settings > API**.
> - Anda bisa mendapatkan `GNEWS_API_KEY` secara gratis di [gnews.io](https://gnews.io/).

---

Proyek ini menggunakan Supabase sebagai backend. Untuk menyiapkan database:
1. Buka **SQL Editor** di Dashboard Supabase Anda.
2. Salin dan jalankan seluruh isi berkas **[docs/setup_database.sql](./docs/setup_database.sql)**.
3. Berkas tersebut mencakup seluruh skema tabel (`transactions`, `targets`, `wallets`, dll) serta kebijakan **RLS (Row Level Security)** untuk keamanan data.

---

## Menjalankan Aplikasi

### 1. Jalankan Backend
```bash
npm run dev:back
```

### 2. Jalankan Frontend (Tab Baru)
```bash
npm run dev:front
```
Aplikasi akan berjalan di `http://localhost:5173`. Perintah di atas dijalankan dari folder root proyek.

---

## Deployment (Dukungan Proxy)

Aplikasi ini dilengkapi dengan **Vercel Serverless Function** untuk mengatasi masalah CORS saat memanggil GNews API di server produksi. Konfigurasi ini terletak di folder `frontend/api/` dan akan aktif secara otomatis jika di-deploy ke Vercel.

---

## Troubleshooting

-   **Error: Failed to fetch (GNews)**: Pastikan `VITE_GNEWS_API_KEY` Anda valid. Jika di lokal, pastikan adblocker tidak memblokir request ke `gnews.io`.
-   **Supabase Auth Error**: Pastikan Anda sudah mengaktifkan fitur **Email Auth** di menu **Authentication > Providers** pada dashboard Supabase.

---

© 2026 **SakuCerdas Team** - Future-Ready Work & Economy.
