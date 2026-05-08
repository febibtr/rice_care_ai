/**
 * aiService.js
 * Simulasi model AI MobileNetV2 menggunakan Claude API sebagai dummy
 * Nanti bisa diganti dengan endpoint TFLite/model asli
 */

const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';
const DIAGNOSIS_CLASSES = ['sehat', 'blast', 'tungro', 'brownspot'];

/**
 * Konversi File ke base64
 */
const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

/**
 * Dummy AI: panggil Claude API untuk analisis gambar daun padi
 * @param {File} imageFile
 * @returns {{ diagnosis, confidence, aiNotes, inferenceTimeMs }}
 */
export const analyzeLeafImage = async (imageFile) => {
  const startTime = Date.now();

  const base64 = await fileToBase64(imageFile);
  const mediaType = imageFile.type || 'image/jpeg';

  const prompt = `Kamu adalah model AI deteksi penyakit daun padi berbasis MobileNetV2 (dummy simulation).
Analisis gambar daun padi ini dan berikan prediksi klasifikasi.

Kembalikan HANYA JSON berikut tanpa teks lain:
{
  "diagnosis": "<sehat | blast | tungro | brownspot>",
  "confidence": {
    "sehat": <0-100>,
    "blast": <0-100>,
    "tungro": <0-100>,
    "brownspot": <0-100>
  },
  "aiNotes": "<satu kalimat deskripsi ciri visual yang terdeteksi>"
}

Aturan:
- Total semua nilai confidence HARUS tepat 100
- diagnosis harus cocok dengan confidence tertinggi
- Jika gambar bukan daun padi, set diagnosis=sehat dengan confidence sehat=95`;

  const response = await fetch(CLAUDE_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 500,
      messages: [
        {
          role: 'user',
          content: [
            { type: 'image', source: { type: 'base64', media_type: mediaType, data: base64 } },
            { type: 'text', text: prompt },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error?.message || 'AI API error');
  }

  const apiData = await response.json();
  const rawText = apiData.content[0].text.trim().replace(/```json|```/g, '').trim();
  const result = JSON.parse(rawText);

  // Validasi diagnosis valid
  if (!DIAGNOSIS_CLASSES.includes(result.diagnosis)) {
    result.diagnosis = 'sehat';
  }

  return {
    diagnosis: result.diagnosis,
    confidence: result.confidence,
    aiNotes: result.aiNotes || '',
    inferenceTimeMs: Date.now() - startTime,
  };
};

/**
 * Label & info statis per diagnosis (fallback jika API diseases kosong)
 */
export const DISEASE_INFO = {
  sehat: {
    label: 'Sehat',
    emoji: '✅',
    severityLabel: 'Tidak ada penyakit',
    severityColor: '#16a34a',
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
    emoji: '🔴',
    severityLabel: 'Risiko Tinggi',
    severityColor: '#dc2626',
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
    emoji: '🟡',
    severityLabel: 'Risiko Sedang',
    severityColor: '#d97706',
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
    emoji: '🟠',
    severityLabel: 'Risiko Sedang',
    severityColor: '#c2410c',
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
};
