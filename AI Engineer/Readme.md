
# 🌾 RiceCare AI: Smart Padi Health Diagnostic

<div align="center">
  
  [![Python](https://img.shields.io/badge/Python-3.9-blue.svg)](https://www.python.org/)
  [![TensorFlow](https://img.shields.io/badge/TensorFlow-2.x-orange.svg)](https://www.tensorflow.org/)
  [![Gradio](https://img.shields.io/badge/Interface-Gradio-red.svg)](https://gradio.app/)

  *Solusi digital untuk membantu petani mendeteksi penyakit padi secara real-time.*

</div>

---

## 🎯 **Tentang Proyek**
**RiceCare AI** dikembangkan untuk mengatasi permasalahan klasik di sektor pertanian: lambatnya deteksi penyakit tanaman. Dengan sistem ini, petani cukup memotret daun padi, dan AI akan memberikan diagnosis dalam hitungan detik.

## 🛠 **Teknologi yang Digunakan**
* **Deep Learning Engine:** `TensorFlow` & `MobileNetV2`
* **Web Interface:** `Gradio`
* **Deployment:** `Hugging Face Spaces`

## 📊 **Alur Kerja (Workflow)**
1. **Input:** User mengunggah gambar daun padi.
2. **Preprocessing:** Gambar di-*resize* ke $224 \times 224$ piksel.
3. **Inference:** Model menganalisis fitur gambar menggunakan arsitektur CNN.
4. **Output:** Menampilkan hasil prediksi penyakit (**Blast, Brown Spot, Tungro, Healthy**) beserta tingkat akurasinya.

## 🚀 **Status Proyek**
- [x] Training Model AI
- [x] Backend Development (`app.py`)
- [x] Frontend Development (`Gradio`)
- [x] Deployment to Hugging Face
- [ ] Dokumentasi Tambahan

## 👨‍💻 **Kontributor**
Dibuat oleh Tim AI:
**Fransiskus Wutuk(CACC611D6Y1186)** untuk **Coding Camp 2026**
**Wega Pratiwi(CACC432D6X1217)** untuk **Coding Camp 2026**

---
*Dibuat dengan semangat untuk ketahanan pangan Indonesia!* 🇮🇩
