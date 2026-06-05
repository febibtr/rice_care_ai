# 🌾 RiceCare AI: Smart Padi Health Diagnostic

<div align="center">

  [![Python](https://img.shields.io/badge/Python-3.9-blue.svg)](https://www.python.org/)
  [![TensorFlow](https://img.shields.io/badge/TensorFlow-2.x-orange.svg)](https://www.tensorflow.org/)
  [![Gradio](https://img.shields.io/badge/Interface-Gradio-red.svg)](https://gradio.app/)

  *Solusi digital berbasis Deep Learning untuk membantu petani mendeteksi penyakit padi secara real-time.*

</div>

---

## 🔗 **Akses Aplikasi**
Coba langsung sistem deteksi penyakit padi kami melalui link di bawah ini:
👉 **[Klik Di Sini untuk Buka RiceCare AI di Hugging Face](https://egott-ricecareai.hf.space/docs)**

---

## 🎯 **Tentang Proyek**
**RiceCare AI** adalah sistem pendukung keputusan yang dirancang untuk membantu petani dan penyuluh pertanian mendeteksi penyakit pada tanaman padi lebih dini. Dengan teknologi AI, deteksi yang dulunya sulit, kini dapat dilakukan hanya dengan satu foto. Dibuat oleh **Tim CC26-PSU169**

## 🛠 **Teknologi yang Digunakan**
* **Deep Learning Engine:** `TensorFlow` & `MobileNetV2`
* **Web Interface:** `Gradio`
* **Deployment:** `Hugging Face Spaces`

## 📊 **Alur Kerja (Workflow)**
1. **Input:** User mengunggah gambar daun padi.
2. **Preprocessing:** Gambar di-*resize* ke $224 \times 224$ piksel dan dinormalisasi.
3. **Inference:** Model menganalisis fitur gambar menggunakan Deep Learning CNN arsitektur MobileNetV2.
4. **Output:** Hasil prediksi penyakit beserta tingkat akurasi (*confidence score*).

## 🚀 **Status Proyek**
- [x] Training Model AI
- [x] Deployment to Hugging Face

## 👨‍💻 **Kontributor**
Dibuat oleh Tim AI:
* **Fransiskus Wutuk** untuk **Coding Camp 2026**
* **Wega Pratiwi** untuk **Coding Camp 2026**

---
*Dibuat dengan semangat untuk ketahanan pangan Indonesia!*
