# 🚀 SakuCerdas - Cerdas Kelola Keuanganmu

**SakuCerdas** adalah aplikasi manajemen keuangan pribadi yang dirancang untuk membantu pengguna dalam merencanakan masa depan finansial, menghitung zakat, hingga memantau berita ekonomi terkini secara real-time. Dengan antarmuka yang modern dan fitur yang lengkap, SakuCerdas menjadi asisten finansial terpercaya di saku Anda.

---

## 🔗 Live Demo

Akses aplikasi secara langsung melalui tautan berikut:
👉 **[https://sakucerdas.vercel.app](https://sakucerdas.vercel.app)**

---

## 👥 Detail Anggota Tim Capstone (SakuCerdas)

| No  | ID Cohort    | Nama                   | Email                              | Asal Sekolah   |
| --- | ------------ | ---------------------- | ---------------------------------- | -------------- |
| 1   | CFS063D6Y558 | Adam Rais Ichsan Kamil | CFS063D6Y558@student.devacademy.id | SMKN 8 Jakarta |
| 2   | CFS063D6X561 | Nahla Chika Khumaira   | CFS063D6X561@student.devacademy.id | SMKN 8 Jakarta |
| 3   | CFS063D6Y565 | Mochamad Bilal Rabani  | CFS063D6Y565@student.devacademy.id | SMKN 8 Jakarta |
| 4   | CFS063D6Y569 | Galen Alvian           | CFS063D6Y569@student.devacademy.id | SMKN 8 Jakarta |
| 5   | CFS063D6Y570 | Alfarisi Azmir         | CFS063D6Y570@student.devacademy.id | SMKN 8 Jakarta |

---

## 🖼️ Dokumentasi Visual (Mockup)

Lihat tampilan antarmuka (UI) SakuCerdas selengkapnya di:
👉 **[Lihat Mockup & Screenshot Aplikasi](./docs/MOCKUP.md)**

---

## 🛠️ Panduan Instalasi & Penggunaan

Untuk teknis instalasi secara detail (termasuk SQL Schema untuk Supabase), silakan baca:
👉 **[Instruksi Lengkap Instalasi & Setup](./USAGE.md)**

---

## ✨ Fitur Utama

-   **📊 Dashboard Interaktif**: Ringkasan saldo, pemasukan, pengeluaran, dan berita ekonomi terbaru (GNews API).
-   **🎯 Target Impian**: Buat dan pantau progres tabungan untuk barang atau impian yang ingin dicapai.
-   **📈 Simulasi Investasi**: Kalkulator bunga majemuk visual untuk melihat pertumbuhan aset di masa depan.
-   **🛡️ Dana Darurat**: Hitung kebutuhan dana cadangan berdasarkan pengeluaran bulanan Anda.
-   **🕌 Zakat Maal**: Kalkulator zakat yang disesuaikan dengan harga emas terkini.
-   **📂 Riwayat Transaksi**: Lacak semua arus kas dengan filter kategori dan tanggal.
-   **🔄 Transaksi Rutin**: Kelola pengeluaran berlangganan dan biaya flat bulanan.
-   **💳 Hutang & Piutang**: Monitor catatan pinjaman dan piutang agar tidak terlewat.
-   **🌗 Tema Dinamis**: Mendukung mode *Dark*, *Sakucerdas (Brand Theme)*, dan *Auto*.

---

## 🛠️ Tech Stack

-   **Frontend**: React.js, Vite, TypeScript.
-   **Backend**: Node.js, Express.
-   **Database/Auth**: Supabase.
-   **Styling**: Custom Vanilla CSS.
-   **API Eksternal**: GNews API.
-   **Icons**: Lucide React.

---

## ⚙️ Instalasi & Penyiapan

### 1. Prasyarat
Pastikan Anda sudah menginstal:
-   [Node.js](https://nodejs.org/) (Versi 18 atau lebih baru)
-   npm (Biasanya terinstal bersama Node.js)

### 2. Kloning & Instalasi
```bash
git clone https://github.com/farishhz/SakuCerdas.git
cd SakuCerdas

# Instal Backend
cd backend
npm install

# Instal Frontend
cd ../frontend
npm install
```

### 3. Konfigurasi Environment Variable

**Backend (`backend/.env`):**
```env
SUPABASE_URL=YOUR_SUPABASE_URL
SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
PORT=8000
```

**Frontend (`frontend/.env`):**
```env
VITE_SUPABASE_URL=YOUR_SUPABASE_URL
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
VITE_SERVER_URL=http://localhost:8000/api
VITE_GNEWS_API_KEY=YOUR_GNEWS_API_KEY
```

---

## 🚀 Cara Menjalankan

### 1. Jalankan Backend
```bash
cd backend
npm run dev
```

### 2. Jalankan Frontend
```bash
cd frontend
npm run dev
```
Aplikasi akan berjalan di: `http://localhost:5173`

---

## 🛡️ Arsitektur BFF (Backend-For-Frontend)
SakuCerdas menggunakan pola **BFF** untuk memisahkan logika bisnis dari antarmuka pengguna. Seluruh kalkulasi skor kesehatan finansial, pengelolaan target, dan pengolahan data transaksi diproses di server Node.js sebelum dikirim ke frontend, sehingga performa aplikasi di sisi klien tetap ringan dan aman.

---

© 2026 **Tim Capstone SMKN 8 Jakarta** - Future-Ready Work & Economy.
