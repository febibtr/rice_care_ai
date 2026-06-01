/**
 * aiService.js
 * Service untuk deteksi penyakit daun padi menggunakan API Hugging Face
 */

const DIAGNOSIS_CLASSES = ['sehat', 'blast', 'tungro', 'brownspot', 'unknown'];

const aiNotesByDiagnosis = {
  sehat: [
    'Daun terlihat hijau segar dengan tekstur rata dan tanpa bercak.',
    'Tidak ditemukan tanda-tanda penyakit atau perubahan warna berarti.',
  ],
  blast: [
    'Terlihat bercak cokelat dengan batas jelas dan permukaan kering.',
    'Bercak seperti belah ketupat menunjukkan gejala blast.',
  ],
  tungro: [
    'Daun menguning dari pangkal dan tampak layu pada ujungnya.',
    'Gejala yang seragam pada daun menandakan kemungkinan tungro.',
  ],
  brownspot: [
    'Bercak kecil coklat dengan halo kuning bertebaran pada daun.',
    'Pattern bercak oval pada daun mengarah ke brown spot.',
  ],
  unknown: [
    'Citra tidak dikenali sebagai penyakit padi yang umum.',
    'Pastikan foto fokus pada bagian daun yang bermasalah.',
  ],
};

const pickNote = (diagnosis, seed) => {
  const notes = aiNotesByDiagnosis[diagnosis] || aiNotesByDiagnosis.sehat;
  return notes[seed % notes.length];
};

/**
 * Analisis gambar daun padi menggunakan API eksternal
 * @param {File} imageFile
 * @returns {{ diagnosis, confidence, aiNotes, inferenceTimeMs }}
 */
export const analyzeLeafImage = async (imageFile) => {
  try {
    // 1. Siapkan data gambar untuk dikirim
    const formData = new FormData();
    // Pastikan 'file' adalah nama key yang diminta oleh API Hugging Face Anda
    formData.append('file', imageFile); 

    // 2. Tembak API Hugging Face
    const startTime = Date.now();
    const response = await fetch('https://egott-ricecare-ai.hf.space/predict', {
      method: 'POST',
      body: formData, // Kirim sebagai multipart/form-data
    });

    if (!response.ok) {
      throw new Error(`Error dari server AI: ${response.statusText}`);
    }

    const data = await response.json();

    // 3. Normalisasi hasil prediksi API agar sesuai dengan key DISEASE_INFO
    let diagnosisKey = (data.prediction || 'sehat').toLowerCase().replace(/[^a-z]/g, '');
    if (diagnosisKey === 'healthy') diagnosisKey = 'sehat';
    if (diagnosisKey.includes('brown')) diagnosisKey = 'brownspot';
    if (!DIAGNOSIS_CLASSES.includes(diagnosisKey)) {
      diagnosisKey = 'unknown'; // Fallback jika model mengembalikan nilai di luar kelas yang diketahui
    }

    // 4. Menyesuaikan format confidence (jika API mengembalikan desimal 0-1, ubah ke persentase 0-100)
    let confPercent = data.confidence || 0.95;
    if (confPercent <= 1 && confPercent > 0) confPercent *= 100;

    return {
      diagnosis: diagnosisKey,
      confidence: { [diagnosisKey]: confPercent },
      topConfidence: confPercent,
      aiNotes: pickNote(diagnosisKey, Date.now()), // Tetap gunakan catatan dinamis lokal
      inferenceTimeMs: Date.now() - startTime,
    };

  } catch (error) {
    console.error("Gagal memanggil API Hugging Face:", error);
    throw error;
  }
};

/**
 * Label & info statis per diagnosis (fallback jika API diseases kosong)
 */
export const DISEASE_INFO = {
  sehat: {
    label: 'Sehat',
    icon: 'ph-leaf',
    cardGradient: 'linear-gradient(135deg, rgba(22,163,74,0.95), rgba(134,239,172,0.92))',
    severityLabel: 'Tidak ada penyakit',
    severityColor: '#16a34a',
    iconColor: '#16a34a',
    iconBg: 'rgba(255,255,255,0.22)',
    description: 'Daun padi dalam kondisi sehat. Tidak ditemukan gejala infeksi penyakit secara visual.',
    treatments: [
      'Tidak ada penanganan khusus yang diperlukan saat ini.',
      'Lanjutkan pemupukan sesuai jadwal.',
      'Pantau kondisi lahan secara berkala.',
    ],
    preventions: [
      'Jaga kebersihan lahan dan saluran irigasi.',
      'Gunakan benih varietas unggul tahan penyakit.',
      'Rotasi tanaman untuk mencegah penumpukan patogen.',
    ],
  },
  blast: {
    label: 'Blast',
    icon: 'ph-fire',
    cardGradient: 'linear-gradient(135deg, rgba(220,38,38,0.95), rgba(251,146,60,0.9))',
    severityLabel: 'Risiko Tinggi',
    severityColor: '#dc2626',
    iconColor: '#dc2626',
    iconBg: 'rgba(255,255,255,0.22)',
    description: 'Terdeteksi gejala Blast (Magnaporthe oryzae). Bercak belah ketupat dengan tepi cokelat dan pusat abu-abu.',
    treatments: [
      'Aplikasikan fungisida Trycyclazole atau Isoprothiolane sesuai dosis.',
      'Hindari pemupukan nitrogen berlebihan.',
      'Cabut dan musnahkan tanaman yang terinfeksi parah.',
      'Semprotkan fungisida sore hari untuk efektivitas optimal.',
    ],
    preventions: [
      'Gunakan varietas tahan Blast: Ciherang atau Mekongga.',
      'Atur jarak tanam cukup untuk sirkulasi udara.',
      'Kurangi kelembapan lahan dengan manajemen air tepat.',
    ],
  },
  tungro: {
    label: 'Tungro',
    icon: 'ph-bug',
    cardGradient: 'linear-gradient(135deg, rgba(245,158,11,0.95), rgba(252,211,77,0.88))',
    severityLabel: 'Risiko Sedang',
    severityColor: '#d97706',
    iconColor: '#d97706',
    iconBg: 'rgba(255,255,255,0.22)',
    description: 'Terdeteksi gejala Tungro (RTBV & RTSV). Daun menguning dari ujung ke pangkal, pertumbuhan terhambat.',
    treatments: [
      'Kendalikan wereng hijau dengan insektisida Buprofezin atau Imidakloprid.',
      'Cabut dan benamkan tanaman sakit ke dalam tanah.',
      'Hindari penanaman di area bersebelahan lahan terserang.',
    ],
    preventions: [
      'Tanam varietas tahan Tungro: IR64, Conde, atau Tukad Petanu.',
      'Lakukan tanam serempak untuk memutus siklus vektor.',
      'Pasang perangkap lampu untuk memantau populasi wereng.',
    ],
  },
  brownspot: {
    label: 'Brown Spot',
    icon: 'ph-warning-circle',
    cardGradient: 'linear-gradient(135deg, rgba(194,65,12,0.95), rgba(251,191,36,0.88))',
    severityLabel: 'Risiko Sedang',
    severityColor: '#c2410c',
    iconColor: '#c2410c',
    iconBg: 'rgba(255,255,255,0.22)',
    description: 'Terdeteksi Brown Spot (Cochliobolus miyabeanus). Bercak cokelat oval dengan halo kuning akibat kekurangan kalium.',
    treatments: [
      'Aplikasikan fungisida Mancozeb atau Iprobenfos sesuai anjuran.',
      'Perbaiki nutrisi dengan pupuk kalium (KCl) dan silika.',
      'Lakukan penyemprotan pagi hari.',
      'Perbaiki drainase lahan.',
    ],
    preventions: [
      'Pastikan kecukupan kalium dan silika sejak awal tanam.',
      'Gunakan benih sehat dengan seed treatment fungisida.',
      'Jaga kondisi lahan tidak terlalu lembap.',
    ],
  },
  unknown: {
    label: 'Tidak Dikenali',
    icon: 'ph-question',
    cardGradient: 'linear-gradient(135deg, rgba(107,114,128,0.95), rgba(209,213,219,0.88))',
    severityLabel: 'Tidak Diketahui',
    severityColor: '#6b7280',
    iconColor: '#6b7280',
    iconBg: 'rgba(255,255,255,0.22)',
    description: 'AI tidak dapat mengidentifikasi penyakit dengan pasti. Hal ini bisa terjadi karena kualitas gambar kurang baik atau objek bukan merupakan daun padi.',
    treatments: [
      'Ambil ulang foto dengan pencahayaan yang lebih baik.',
      'Pastikan objek daun padi berada tepat di tengah frame.',
    ],
    preventions: [
      'Gunakan kamera dengan resolusi minimal 2MP.',
    ],
  },
};
