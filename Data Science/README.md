#  RiceCare AI - Exploratory Data Analysis Dashboard

Exploratory Data Analysis Dashboard untuk proyek deteksi penyakit daun padi menggunakan Deep Learning (MobileNetV2).
Dibuat oleh Tim Data Scientist CC26-PSU169 | Coding Camp 2026 × DBS Foundation.

---

## Struktur Proyek
Data Science/           
├── cleaning_eda_data.ipynb  
├── dashboard_capstone.py  
├── README.md  
├── requirements.txt  
└── url_dashboard.txt

---

##  Setup Environment

```bash
python -m venv namenv
pip install -r requirements.txt

```

---

## Link Dataset

```bash
https://drive.google.com/drive/folders/1ZNjzVXgtZV9VxqxRS1ZBTr0iPlNkolkm

```

---

---

## Run Streamlit App

```bash
streamlit run dashboard/dashboard_capstone.py
```

---

## Fitur Dashboard

- **Overview & Data Dictionary**: Ringkasan proyek dan penjelasan tiap kelas penyakit
- **Visualisasi EDA**: Distribusi dataset, perbandingan train vs test, before/after augmentasi, mean image per kelas, dan distribusi RGB
- **Galeri Sampel Gambar**: Menampilkan sampel gambar acak per kelas dengan jumlah yang dapat disesuaikan

---

## Kelas Penyakit

| Kelas | Keterangan |
|-------|-----------|
| Blast | Penyakit jamur Magnaporthe oryzae yang menyerang daun |
| Brown Spot | Bercak coklat akibat jamur Helminthosporium oryzae |
| Tungro | Virus yang ditularkan wereng hijau, daun menguning |
| Healthy | Daun padi dalam kondisi sehat |
| Unknown | Gambar di luar kategori penyakit daun padi |

--- 

## 👥 Tim Data Scientist

- Rifa Agnia (CDC001D6X1252)
- Nisa Nuraini (CDC004D6X2390)
