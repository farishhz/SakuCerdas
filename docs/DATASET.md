# Informasi Dataset & Sumber Data - SakuCerdas

Dokumen ini menjelaskan sumber data, metodologi perhitungan, dan struktur data yang digunakan dalam aplikasi **SakuCerdas**.

---

## 1. Data Berita Ekonomi (Real-time)
SakuCerdas tidak menggunakan dataset berita statis. Kami mengintegrasikan **GNews API** untuk mengambil berita ekonomi secara real-time.
- **Sumber**: [GNews.io](https://gnews.io/)
- **Metode**: Pencarian berbasis kata kunci (*Business*, *Finance*, *Economy*) yang difilter khusus untuk wilayah Indonesia.
- **Tujuan**: Memberikan literasi finansial yang relevan dengan kondisi pasar terkini.

---

## 2. Dataset Internal (Pre-defined Categories)
Kami menggunakan dataset internal untuk kategori transaksi default guna mempermudah user dalam pengelompokan arus kas.
- **Kategori Pemasukan**: Gaji, Hadiah, Investasi, Bonus.
- **Kategori Pengeluaran**: Makan & Minum, Transportasi, Hiburan, Tabungan, Tagihan, Kesehatan.

---

## 3. Metodologi Perhitungan (Logic Dataset)
Algoritma perhitungan dalam aplikasi didasarkan pada standar finansial universal:

### A. Zakat Maal (Emas & Kekayaan)
- **Nishab**: Setara dengan 85 gram emas.
- **Tarif**: 2.5% dari total kekayaan yang sudah mencapai Haul (1 tahun).
- **Data Input**: User memasukkan harga emas terkini untuk validasi status wajib zakat.

### B. Dana Darurat (Emergency Fund)
- **Lajang**: 6x Pengeluaran Bulanan.
- **Menikah**: 9x Pengeluaran Bulanan.
- **Menikah & Anak**: 12x Pengeluaran Bulanan.

### C. Simulasi Investasi (Compound Interest)
- **Rumus**: `A = P (1 + r/n)^(nt)`
- Dimana `A` adalah jumlah akhir, `P` modal awal, `r` bunga tahunan, `t` waktu dalam tahun.

---

## 4. Skema Database (Supabase / PostgreSQL)

SakuCerdas menggunakan database relasional PostgreSQL yang dikelola melalui Supabase. Berikut adalah rincian struktur tabel yang digunakan untuk menyimpan data pengguna secara terenkripsi dan terorganisir:

### A. Tabel Utama (Core)
| Nama Tabel | Field Utama | Deskripsi |
| :--- | :--- | :--- |
| **`profiles`** | `id`, `full_name`, `phone`, `xp`, `level` | Menyimpan profil pengguna dan sistem gamifikasi pengalaman (XP). |
| **`categories`** | `id`, `name`, `icon`, `type` | Daftar kategori transaksi (Makan, Gaji, dll) beserta ikon Lucide. |
| **`wallets`** | `id`, `name`, `balance`, `is_default` | Menyimpan saldo dari berbagai sumber (Tunai, Bank, E-wallet). |

### B. Tabel Transaksi & Perencanaan
| Nama Tabel | Field Utama | Deskripsi |
| :--- | :--- | :--- |
| **`transactions`** | `user_id`, `type`, `amount`, `wallet_id`, `category_id` | Log arus kas keluar dan masuk pengguna. |
| **`targets`** | `name`, `target_amount`, `current_amount`, `is_completed` | Data impian/tabungan yang ingin dicapai pengguna. |
| **`target_deposits`**| `target_id`, `amount`, `note` | Log setiap kali pengguna menabung ke dalam target tertentu. |
| **`budgets`** | `category_id`, `limit_amount`, `month`, `year` | Batasan pengeluaran per kategori yang disetel pengguna. |

### C. Tabel PendukungFitur
| Nama Tabel | Field Utama | Deskripsi |
| :--- | :--- | :--- |
| **`debts_loans`** | `type`, `person_name`, `amount`, `is_paid` | Catatan hutang (ke kita) dan piutang (kita ke orang). |
| **`recurring_transactions`** | `name`, `amount`, `interval`, `next_date` | Daftar tagihan rutin atau pendapatan tetap yang berulang. |

### D. Relasi Antar Tabel (Entity Relationship)
- **One-to-Many (`profiles` ➔ `transactions`)**: Satu pengguna bisa memiliki banyak catatan transaksi.
- **One-to-Many (`wallets` ➔ `transactions`)**: Setiap transaksi terikat pada satu dompet/sumber dana tertentu.
- **Many-to-One (`transactions` ➔ `categories`)**: Banyak transaksi dapat dikategorikan ke dalam satu jenis kategori yang sama.
- **One-to-Many (`targets` ➔ `target_deposits`)**: Satu target impian dapat diisi melalui banyak kali proses menabung (*deposits*).

---

© 2026 **SakuCerdas Team** - Financial Transparency Report.
