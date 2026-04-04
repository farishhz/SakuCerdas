# 🚀 SakuCerdas - Cerdas Kelola Keuanganmu

**SakuCerdas** adalah aplikasi manajemen keuangan pribadi yang dirancang untuk membantu pengguna dalam merencanakan masa depan finansial, menghitung zakat, hingga memantau berita ekonomi terkini secara real-time. Dengan antarmuka yang modern dan fitur yang lengkap, SakuCerdas menjadi asisten finansial terpercaya di saku Anda.

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
-   **Styling**: Custom Vanilla CSS.
-   **Backend/Database**: Supabase (Database & Authentication).
-   **API Eksternal**: GNews API (News Literacy).
-   **Icons**: Lucide React.

---

## ⚙️ Instalasi & Penyiapan

### 1. Prasyarat
Pastikan Anda sudah menginstal:
-   [Node.js](https://nodejs.org/) (Versi 18 atau lebih baru)
-   npm (Biasanya terinstal bersama Node.js)

### 2. Kloning Repositori
```bash
git clone https://github.com/farishhz/SakuCerdas.git
cd SakuCerdas
```

### 3. Penyiapan Frontend
Masuk ke direktori frontend, instal dependensi, dan siapkan file `.env`:
```bash
cd frontend
npm install
```

### 4. Konfigurasi Environment Variable
Buat file bernama `.env` di dalam folder `frontend` dan tambahkan variabel berikut (tanpa tanda kutip):
```env
VITE_SUPABASE_URL=YOUR_SUPABASE_URL
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
VITE_GNEWS_API_KEY=YOUR_GNEWS_API_KEY
VITE_APP_NAME=SakuCerdas
VITE_APP_URL=http://localhost:5173
```
> [!IMPORTANT]
> Jangan pernah mengunggah file `.env` asli ke GitHub. Gunakan `.env.example` sebagai referensi bagi kontributor lain.

---

## 🚀 Cara Menjalankan

### Mode Pengembangan (Development)
```bash
# Di dalam folder frontend
npm run dev
```
Aplikasi akan berjalan di: `http://localhost:5173`

### Mode Produksi (Build)
```bash
npm run build
```
Hasil build akan tersimpan di folder `dist`.

---

## 🌐 Informasi Penting Lainnya

-   **Deployment**: Aplikasi ini dioptimalkan untuk di-deploy menggunakan **Vercel**.
-   **Proxy API**: Untuk menghindari masalah CORS pada GNews API di produksi, aplikasi menggunakan Vercel Serverless Functions yang terletak di folder `frontend/api/`.
-   **Privasi Data**: Pastikan repositori di GitHub diatur ke **Private** sesuai instruksi pengumpulan proyek.

---

© 2024 **Tim Capstone SMKN 8 Jakarta** - Future-Ready Work & Economy.
