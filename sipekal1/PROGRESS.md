# PROGRESS e-Sarpras RS

## Status Screen
- ✅ Screen 1: Halaman Login — selesai (commit: ed29c899e1074762139fdcb6dc4d18bf4a91b74a)
- ⬜ Screen 2: Dashboard Utama — belum
- ⬜ Screen 3: Form Laporan Kerusakan Baru — belum
- ⬜ Screen 4: Panel Verifikasi & Disposisi Tiket — belum
- ⬜ Screen 5: Panel Assign Teknisi — belum
- ⬜ Screen 6: Daftar Tiket & Status — belum
- ⬜ Screen 7: Daftar Riwayat Perbaikan — belum
- ⬜ Screen 8: Dashboard Monitoring Analitik — belum

## Komponen Shared yang Sudah Ada
- AuthProvider (`src/components/AuthProvider.tsx`)
- LoginForm (`src/components/LoginForm.tsx`)

## Catatan Teknis
- Env vars yang dibutuhkan:
  - `DATABASE_URL` (koneksi Neon PostgreSQL)
  - `NEXTAUTH_SECRET` (secret untuk NextAuth JWT)
  - `NEXTAUTH_URL` (URL aplikasi)
- Struktur folder utama:
  - `src/app`: Root aplikasi Next.js App Router (Layout, Login Page, Auth API, Dashboard placeholder).
  - `src/components`: Komponen UI re-usable (LoginForm, AuthProvider).
  - `src/db`: Konfigurasi schema Drizzle ORM, enum database, serta script seeding.
