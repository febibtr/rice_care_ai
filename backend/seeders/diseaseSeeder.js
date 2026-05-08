require('dotenv').config();
const mongoose = require('mongoose');
const Disease = require('../models/Disease');
const logger = require('../utils/logger');

const diseases = [
  {
    key: 'sehat',
    name: 'Sehat',
    latinName: 'Oryza sativa (kondisi normal)',
    severity: 'none',
    emoji: '✅',
    description:
      'Daun padi dalam kondisi optimal. Warna hijau merata, tidak ada bercak, bintik, atau perubahan warna yang mencurigakan. Pertahankan praktik budidaya yang baik untuk mencegah munculnya penyakit.',
    symptoms: ['Warna daun hijau merata', 'Tidak ada bercak atau lesi', 'Pertumbuhan normal', 'Anakan cukup banyak'],
    treatments: [
      'Tidak ada penanganan khusus yang diperlukan saat ini.',
      'Lanjutkan pemupukan sesuai jadwal untuk menjaga nutrisi tanaman.',
      'Pantau kondisi lahan secara berkala untuk deteksi dini.',
    ],
    preventions: [
      'Jaga kebersihan lahan dan saluran irigasi secara rutin.',
      'Gunakan benih varietas unggul yang tahan penyakit.',
      'Terapkan rotasi tanaman untuk mencegah penumpukan patogen di tanah.',
      'Monitor kondisi tanaman setiap minggu, terutama saat musim hujan.',
    ],
    isActive: true,
  },
  {
    key: 'blast',
    name: 'Blast',
    latinName: 'Magnaporthe oryzae',
    severity: 'high',
    emoji: '🔴',
    description:
      'Penyakit jamur paling merusak pada tanaman padi. Disebabkan oleh cendawan Magnaporthe oryzae yang menyerang daun, ruas batang (node blast), dan malai (neck blast). Dapat menyebabkan kehilangan hasil panen hingga 100% jika tidak segera ditangani.',
    symptoms: [
      'Bercak berbentuk belah ketupat (spindle shape)',
      'Tepi bercak berwarna cokelat kemerahan',
      'Bagian tengah bercak berwarna abu-abu',
      'Pada serangan berat, daun mengering sepenuhnya',
      'Leher malai berwarna cokelat dan patah (neck blast)',
    ],
    treatments: [
      'Aplikasikan fungisida berbahan aktif Trycyclazole (0,5–1 g/L) atau Isoprothiolane sesuai dosis anjuran.',
      'Hindari pemupukan nitrogen berlebihan yang dapat memperparah serangan.',
      'Cabut dan musnahkan tanaman yang terinfeksi parah untuk mencegah penyebaran.',
      'Lakukan penyemprotan fungisida pada sore hari (16.00–18.00) untuk efektivitas optimal.',
      'Konsultasikan dengan penyuluh pertanian setempat untuk penanganan lebih lanjut.',
    ],
    preventions: [
      'Gunakan varietas padi tahan Blast seperti Ciherang, Mekongga, atau Inpari.',
      'Atur jarak tanam yang cukup (20×20 cm atau 25×25 cm) untuk sirkulasi udara yang baik.',
      'Kurangi kelembapan lahan dengan manajemen air berselang (intermittent irrigation).',
      'Hindari penggunaan pupuk N berlebihan, terutama pada fase vegetatif akhir.',
      'Lakukan seed treatment sebelum tanam dengan larutan fungisida untuk perlindungan awal.',
    ],
    isActive: true,
  },
  {
    key: 'tungro',
    name: 'Tungro',
    latinName: 'Rice Tungro Bacilliform Virus (RTBV) & Rice Tungro Spherical Virus (RTSV)',
    severity: 'medium',
    emoji: '🟡',
    description:
      'Penyakit virus yang disebabkan oleh dua virus berbeda (RTBV dan RTSV) dan ditularkan oleh wereng hijau (Nephotettix virescens). Merupakan penyakit virus paling merusak di Asia Selatan dan Tenggara, termasuk Indonesia.',
    symptoms: [
      'Daun menguning dari ujung ke arah pangkal',
      'Pertumbuhan tanaman terhambat (kerdil)',
      'Jumlah anakan berkurang drastis',
      'Daun berwarna kuning-oranye pada serangan berat',
      'Malai tidak terbentuk atau hampa',
    ],
    treatments: [
      'Kendalikan vektor wereng hijau dengan insektisida berbahan aktif Buprofezin atau Imidakloprid sesuai dosis.',
      'Cabut dan benamkan tanaman sakit ke dalam tanah untuk mengurangi sumber inokulum.',
      'Hindari penanaman di area yang bersebelahan dengan lahan yang terserang tungro.',
      'Konsultasikan dengan penyuluh pertanian setempat untuk penanganan terpadu.',
    ],
    preventions: [
      'Tanam varietas tahan Tungro seperti IR64, Conde, atau Tukad Petanu.',
      'Lakukan tanam serempak bersama petani sekitar untuk memutus siklus hidup vektor.',
      'Pasang perangkap lampu (light trap) untuk memantau dan mengurangi populasi wereng.',
      'Bersihkan gulma di sekitar lahan yang dapat menjadi inang alternatif vektor.',
      'Hindari tanam di dekat lahan yang sudah terinfeksi tungro.',
    ],
    isActive: true,
  },
  {
    key: 'brownspot',
    name: 'Brown Spot',
    latinName: 'Cochliobolus miyabeanus (Helminthosporium oryzae)',
    severity: 'medium',
    emoji: '🟠',
    description:
      'Penyakit jamur yang sering dikaitkan dengan kondisi tanah yang kekurangan unsur hara, terutama kalium dan silika. Dapat muncul pada semua fase pertumbuhan padi. Pada serangan berat, menyebabkan daun mengering prematur dan biji hampa.',
    symptoms: [
      'Bercak oval atau bulat berwarna cokelat di permukaan daun',
      'Tepi bercak berwarna kuning (halo kuning)',
      'Bercak berukuran 0,5–1 cm, tersebar di seluruh permukaan daun',
      'Pada serangan berat, daun mengering dari ujung',
      'Biji padi dapat terinfeksi menyebabkan bercak cokelat pada sekam',
    ],
    treatments: [
      'Aplikasikan fungisida berbahan aktif Mancozeb (2 g/L) atau Iprobenfos sesuai anjuran.',
      'Perbaiki nutrisi tanaman dengan pemupukan kalium (KCl) dan silika secara tepat.',
      'Lakukan penyemprotan pada pagi hari (06.00–09.00) untuk hasil terbaik.',
      'Perbaiki sistem drainase lahan untuk mengurangi kelembapan berlebih.',
    ],
    preventions: [
      'Pastikan kecukupan nutrisi tanaman terutama kalium dan silika sejak awal tanam.',
      'Gunakan benih sehat dan lakukan seed treatment dengan fungisida sebelum tanam.',
      'Jaga kondisi lahan tidak terlalu lembap dengan manajemen irigasi yang baik.',
      'Bersihkan sisa tanaman sakit setelah panen untuk mengurangi sumber inokulum.',
      'Rotasi tanaman dengan tanaman bukan inang (non-padi) untuk memutus siklus penyakit.',
    ],
    isActive: true,
  },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    logger.info('MongoDB connected for seeding...');

    // Hapus data lama
    await Disease.deleteMany({});
    logger.info('Existing diseases cleared.');

    // Insert data baru
    const result = await Disease.insertMany(diseases);
    logger.info(`✅ ${result.length} diseases seeded successfully:`);
    result.forEach((d) => logger.info(`   - ${d.emoji} ${d.name} (${d.key})`));

    await mongoose.connection.close();
    logger.info('MongoDB connection closed. Seeding complete!');
    process.exit(0);
  } catch (error) {
    logger.error(`Seeding failed: ${error.message}`);
    process.exit(1);
  }
};

seed();
