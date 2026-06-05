# RiceCare AI - Deteksi Penyakit Daun Padi

RiceCare AI adalah platform berbasis web yang menggunakan kecerdasan buatan (CNN MobileNetV2) untuk mendeteksi penyakit pada daun padi melalui citra gambar. Proyek ini bertujuan untuk membantu petani mengidentifikasi penyakit secara instan dan memberikan panduan penanganan yang tepat.

## 🚀 Teknologi yang Digunakan

- **Frontend:** React.js, Vite, **Axios** (API Client), Bootstrap, Phosphor Icons.
- **Backend:** Node.js, Express.js, MongoDB & Mongoose (Database), **JSON Web Token (JWT)**, **Multer** (File Upload), **Sharp** (Image Processing), **BcryptJS** (Password Hashing).
- **Security & Logging:** **Helmet**, **Express Rate Limit**, **Morgan**, **Winston** (Logger).
- **Data Science & AI:** **Python**, **TensorFlow/Keras**, **MobileNetV2** (CNN), **Computer Vision**, **Hugging Face Spaces API**.

---

## 🧠 Informasi Model AI

Aplikasi ini terintegrasi dengan model AI yang dideploy di Hugging Face Spaces.

- **Endpoint API:** `https://egott-ricecare-ai.hf.space/predict`
- **Arsitektur:** MobileNetV2 (Convolutional Neural Network).
- **Input:** Gambar daun padi (format `.jpg`, `.png`, atau `.webp`).
- **Kategori Prediksi:**
  - **Sehat:** Daun padi dalam kondisi normal.
  - **Blast:** Penyakit jamur *Magnaporthe oryzae*.
  - **Tungro:** Penyakit virus yang ditularkan oleh wereng hijau.
  - **Brown Spot:** Penyakit jamur akibat kekurangan unsur hara.
  - **Unknown:** Citra tidak dikenali sebagai daun padi atau kualitas gambar rendah.

---

## ⚙️ Konfigurasi Environment

Anda perlu membuat file `.env` di folder `backend` dan `frontend` sebelum menjalankan aplikasi.

### Backend (`/backend/.env`)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/rice_care_ai
NODE_ENV=development

# JWT Secret
JWT_ACCESS_SECRET=your_super_secret_access_key
JWT_REFRESH_SECRET=your_super_secret_refresh_key

# CORS (URL Frontend)
FRONTEND_URL=http://localhost:5173,http://localhost:3000

# Rate Limiter
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
```

### Frontend (`/frontend/.env`)
```env
VITE_API_URL=http://localhost:5000/api/v1
```

---

## 🛠️ Cara Instalasi & Menjalankan Aplikasi

### 1. Persiapan Awal
Pastikan Anda sudah menginstal **Node.js** dan **MongoDB** di perangkat Anda.

### 2. Instalasi Dependensi
Buka terminal dan jalankan perintah berikut di masing-masing direktori:

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### 3. Setup Database (Seeding)
Sebelum menjalankan aplikasi, masukkan data dasar penyakit ke dalam MongoDB agar sistem dapat menampilkan informasi penanganan:
```bash
cd backend
node seeders/diseaseSeeder.js
```

### 4. Menjalankan Aplikasi
Jalankan server backend dan frontend secara bersamaan.

**Jalankan Backend:**
```bash
cd backend
npm start
# atau jika menggunakan nodemon
npm run dev
```

**Jalankan Frontend:**
```bash
cd frontend
npm run dev
```
---

© 2025-2026 RiceCare AI Team. Dibuat untuk petani Indonesia.