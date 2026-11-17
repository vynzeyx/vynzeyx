# Website Bio Link & Media Sosial 🚀

Website bio link modern, cepat, dan responsif (seperti Linktree / Bento) untuk menampilkan semua akun media sosial dan tautan penting Anda.

## ✨ Fitur Unggulan
- **Desain Modern & Glassmorphism**: Tampilan elegan dengan nuansa gradient dan efek blur modern.
- **Dark / Light Mode**: Mendukung peralihan mode gelap dan terang dengan tombol toggle.
- **Ikon Lengkap**: Menggunakan Font Awesome 6 & Lucide Icons untuk ikon media sosial resmi (Instagram, TikTok, YouTube, WhatsApp, GitHub, LinkedIn, Spotify, dll).
- **Featured / Highlight Card**: Bagian tautan utama yang menonjol untuk project atau konten terbaru.
- **Fitur Bagikan & Salin Tautan**: Mendukung native Web Share API dan otomatis salin ke clipboard dengan notifikasi toast.
- **QR Code Popup**: Pengunjung bisa langsung scan QR code untuk membuka tautan Anda di smartphone.
- **Mudah Diedit**: Semua data profil dan tautan dipusatkan di satu file: `data.js`.

---

## 🛠️ Cara Mengubah Data & Tautan Anda

Buka file [`data.js`](data.js) menggunakan text editor pilihan Anda (VS Code, Notepad, dll).

### 1. Ubah Informasi Profil
```javascript
const profileData = {
  name: "Nama Lengkap Anda",
  handle: "@username_anda",
  avatar: "URL_FOTO_ANDA_ATAU_NAMA_FILE_LOKAL.jpg",
  status: "Open for collaborations ✨",
  bio: "Tuliskan deskripsi singkat atau bio Anda di sini.",
  email: "emailanda@domain.com",
  ...
```

### 2. Tambah / Ubah Tautan Media Sosial
Pada array `links` di `data.js`, Anda bisa menambahkan atau mengedit link sesuka hati:
```javascript
{
  title: "Follow Instagram Saya",
  subtitle: "Update reels & behind the scenes",
  url: "https://instagram.com/username_anda",
  iconClass: "fa-brands fa-instagram text-pink-500",
  badge: "Feed"
}
```

---

## 🌐 Cara Menjalankan di Komputer

Cukup klik dua kali file **`index.html`** untuk membukanya langsung di browser (Google Chrome, Edge, Firefox, dll).

Atau jika menggunakan VS Code, gunakan ekstensi **Live Server** (klik kanan `index.html` > *Open with Live Server*).

---

## 🚀 Cara Publikasi / Deploy Gratis ke Internet
Anda bisa mengunggah website ini secara gratis agar bisa diakses oleh siapa saja:
1. **GitHub Pages**: Buat repository baru di GitHub, unggah file ini, lalu aktifkan *GitHub Pages* di Settings > Pages.
2. **Vercel / Netlify**: Cukup *drag and drop* folder ini ke dashboard [Netlify Drop](https://app.netlify.com/drop) atau sambungkan akun GitHub ke [Vercel](https://vercel.com).
