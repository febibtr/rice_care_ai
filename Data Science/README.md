#  RiceCare AI - Exploratory Data Analysis Dashboard

Exploratory Data Analysis Dashboard berfungsi untuk menguraikan kondisi dataset yang nantinya akan menjadi fondasi dalam melatih model MobileNetV2 untuk mendeteksi penyakit daun padi.
Dibuat oleh Tim Data Scientist CC26-PSU169 | Coding Camp 2026 × DBS Foundation.

---

## Structure
Data Science/           
├── cleaning_eda_data.ipynb    
├── cleaning_eda_data.pdf      
├── dashboard_capstone.py    
├── laporan_komprehensif_ds.pdf    
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

## Dataset (Unzip)

```bash
https://drive.google.com/drive/folders/1ZNjzVXgtZV9VxqxRS1ZBTr0iPlNkolkm

```

---

## Run Streamlit App

```bash
streamlit run dashboard/dashboard_capstone.py
```

---

## Dashboard Features

- **Overview & Data Dictionary**: Ringkasan proyek dan penjelasan tiap kelas penyakit
- **Explore & Explain Data**: Terdiri dari distribusi dataset, perbandingan train vs test, kondisi dataset sebelum dan sesudah augmentasi, gambar tipikal per kelas, dan distribusi RGB pada kelas penyakit
- **Image Samples**: Menampilkan sampel gambar acak per kelas dengan jumlah yang dapat disesuaikan

---

## 👥 Tim Data Scientist

- Rifa Agnia (CDC001D6X1252)
- Nisa Nuraini (CDC004D6X2390)
