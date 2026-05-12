import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import farmBg from '../assets/fram-padi.jpg';

const langkah = [
  {
    title: 'Buat Akun',
    icon: 'ph-user-circle-plus',
    iconBg: '#dcfce7',
    iconColor: '#16a34a',
    desc: 'Daftar akun terlebih dahulu untuk menggunakan fitur RiceCare AI secara penuh.',
    detail: 'Proses registrasi cepat dan gratis. Cukup masukkan nama, email, dan password.'
  },
  {
    title: 'Scan Daun Padi',
    icon: 'ph-camera-plus',
    iconBg: '#dbeafe',
    iconColor: '#2563eb',
    desc: 'Upload atau ambil foto langsung dari kamera untuk memulai deteksi penyakit tanaman.',
    detail: 'Mendukung upload file atau kamera langsung. Format JPG, PNG, dan WEBP.'
  },
  {
    title: 'Lihat Hasil AI',
    icon: 'ph-brain',
    iconBg: '#fef9c3',
    iconColor: '#ca8a04',
    desc: 'Sistem CNN akan menampilkan hasil diagnosa beserta tingkat keyakinan AI.',
    detail: 'Hasil analisis tampil dalam hitungan detik dengan confidence score dan detail penyakit.'
  },
  {
    title: 'Terapkan Penanganan',
    icon: 'ph-first-aid-kit',
    iconBg: '#fee2e2',
    iconColor: '#dc2626',
    desc: 'Baca solusi dan panduan penanganan penyakit padi secara lengkap dan terperinci.',
    detail: 'Panduan berbasis ilmiah mencakup pengobatan, pencegahan, dan dosis yang tepat.'
  }
];

const features = [
  {
    icon: 'ph-camera-rotate', title: 'Deteksi Instan',
    desc: 'Unggah atau ambil foto tanaman padi. AI kami menganalisis dalam hitungan detik.',
    path: '/scan'
  },
  {
    icon: 'ph-clock-counter-clockwise', title: 'Riwayat Lengkap',
    desc: 'Semua hasil pemeriksaan tersimpan rapi dan mudah diakses kapan saja.',
    path: '/riwayat'
  },
  {
    icon: 'ph-shield-check', title: 'Panduan Penanganan',
    desc: 'Rekomendasi solusi berbasis ilmiah untuk setiap penyakit yang terdeteksi.',
    path: '/penanganan'
  }
];

const teamMembers = [
  {
    photo: '/putri.jpeg',
    name: 'Putri Dwi R',
    role: 'Frontend',
    icon: 'ph-paint-brush',
    color: '#e879f9'
  },
  {
    photo: '/febi.jpeg',
    name: 'Febi Bahtiyar',
    role: 'Backend',
    icon: 'ph-code',
    color: '#38bdf8'
  },
  {
    photo: null,
    name: 'Reza Firmansyah',
    role: 'AI Engineer',
    icon: 'ph-brain',
    color: '#34d399',
    initials: 'RF'
  },
  {
    photo: null,
    name: 'Nadia Kusuma',
    role: 'AI Engineer',
    icon: 'ph-cpu',
    color: '#34d399',
    initials: 'NK'
  },
  {
    photo: null,
    name: 'Ahmad Yusuf',
    role: 'Data Science',
    icon: 'ph-chart-line-up',
    color: '#fb923c',
    initials: 'AY'
  },
  {
    photo: null,
    name: 'Siti Rahayu',
    role: 'Data Science',
    icon: 'ph-database',
    color: '#fb923c',
    initials: 'SR'
  }
];

export default function Landing() {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('ricecare_auth') === 'true';
  const revealRefs = useRef([]);

  const goToScan = () => navigate(isLoggedIn ? '/scan' : '/register');

  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.12 }
    );
    revealRefs.current.forEach(el => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const addReveal = (el) => { if (el && !revealRefs.current.includes(el)) revealRefs.current.push(el); };

  return (
    <div className="page-shell">
      <Navbar />
      <main className="landing-main">

        {/* ── HERO ── */}
        <section className="hero-section-custom">
          <div className="hero-left">
            <div className="hero-badge">
              <i className="ph ph-sparkle"></i> Inovasi AI untuk Pertanian
            </div>
            <h1 className="hero-h1">
              Sahabat <span className="green-text">Petani</span><br/>
              Masa Depan
            </h1>
            <p className="hero-desc">
              Platform AI canggih untuk mendeteksi penyakit daun padi, memberikan riwayat pemeriksaan,
              dan rekomendasi penanganan berbasis kecerdasan buatan.
            </p>
            <div className="hero-cta-row">
              <button className="btn-hero-primary" onClick={goToScan} type="button">
                <i className="ph ph-scan"></i> Mulai Deteksi
              </button>
              <a className="btn-hero-secondary" href="#cara-pakai">
                <i className="ph ph-play-circle"></i> Cara Pakai
              </a>
            </div>
            <div className="hero-stats-row">
              <div className="hero-stat">
                <div className="num">5K<span>+</span></div>
                <div className="lbl">Dataset Citra</div>
              </div>
              <div className="hero-stat">
                <div className="num">95<span>%</span></div>
                <div className="lbl">Akurasi Model</div>
              </div>
              <div className="hero-stat">
                <div className="num">4</div>
                <div className="lbl">Kategori Penyakit</div>
              </div>
            </div>
          </div>
          <div className="hero-right">
            <img src={farmBg} alt="Tanaman Padi" />
            <div className="hero-float-card">
              <div className="icon-wrap">🌾</div>
              <div className="card-text">
                <div className="big">Analisis AI</div>
                <div className="sml">Real-time detection</div>
              </div>
            </div>
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section className="feature-section" ref={addReveal}>
          <div className="section-label">
            <i className="ph ph-lightning"></i> Fitur Utama
          </div>
          <h2 className="section-title">Semua yang kamu butuhkan<br/><span>dalam satu platform</span></h2>
          <div className="feature-grid">
            {features.map((f, i) => (
              <button
                key={i}
                className="feature-card reveal"
                onClick={() => navigate(isLoggedIn ? f.path : '/register')}
                type="button"
                ref={addReveal}
                style={{ transitionDelay: `${i * 0.1}s` }}
              >
                <div className="feature-icon">
                  <i className={`ph ${f.icon}`}></i>
                </div>
                <h5>{f.title}</h5>
                <p>{f.desc}</p>
                <div className="feature-arrow">
                  Selengkapnya <i className="ph ph-arrow-right"></i>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* ── CARA PAKAI ── */}
        <section className="cara-section" id="cara-pakai" ref={addReveal}>
          <div className="section-label">
            <i className="ph ph-map-trifold"></i> Panduan
          </div>
          <h2 className="section-title">Cara <span>Penggunaan</span></h2>
          <p className="cara-subtitle">Empat langkah mudah memulai deteksi penyakit padi dengan AI</p>

          {/* Two-column grid layout */}
          <div className="cara-grid">
            {langkah.map((l, i) => (
              <div key={i} className="cara-step-simple">
                <div className="cara-step-icon-simple" style={{ background: l.iconBg, color: l.iconColor }}>
                  <i className={`ph ${l.icon}`}></i>
                </div>
                <div className="cara-step-content">
                  <div className="cara-step-num-simple">{i + 1}</div>
                  <h4 className="cara-step-title-simple">{l.title}</h4>
                  <p className="cara-step-desc">{l.desc}</p>
                  <p className="cara-step-detail">{l.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── INFO AI ── */}
        <section className="info-section" id="info-ai">
          <div className="section-label">
            <i className="ph ph-brain"></i> Teknologi
          </div>
          <h2 className="section-title">Informasi <span>Model AI</span></h2>
          <div className="info-grid">
            <div className="info-box reveal" ref={addReveal}>
              <div className="info-box-icon-v2"><i className="ph ph-graph"></i></div>
              <h4>Metode CNN</h4>
              <p>Menggunakan Convolutional Neural Network MobileNetV2 untuk klasifikasi citra daun padi secara akurat.</p>
            </div>
            <div className="info-box reveal" ref={addReveal} style={{transitionDelay:'.1s'}}>
              <div className="info-box-icon-v2"><i className="ph ph-database"></i></div>
              <h4>Dataset</h4>
              <p>Model dilatih dengan 5000+ citra daun padi yang dikurasi secara ilmiah dari berbagai kondisi.</p>
            </div>
            <div className="info-box reveal" ref={addReveal} style={{transitionDelay:'.2s'}}>
              <div className="info-box-icon-v2"><i className="ph ph-sliders-horizontal"></i></div>
              <h4>Threshold</h4>
              <p>Confidence AI di atas 75% untuk memastikan hasil diagnosis yang dapat diandalkan petani.</p>
            </div>
            <div className="info-box reveal" ref={addReveal} style={{transitionDelay:'.3s'}}>
              <div className="info-box-icon-v2"><i className="ph ph-chart-line-up"></i></div>
              <h4>Akurasi per Kelas</h4>
              <div className="accuracy-bar-wrap">
                {[['Sehat','95'],['Blast','93'],['Tungro','91'],['Brown','89']].map(([l,p])=>(
                  <div key={l} className="acc-row">
                    <span className="acc-label">{l}</span>
                    <div className="acc-bar"><div className="acc-fill" style={{width:`${p}%`}}></div></div>
                    <span className="acc-pct">{p}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── TEAM ── */}
        <section className="dev-section" ref={addReveal}>
          <div className="section-label">
            <i className="ph ph-users-three"></i> Tim
          </div>
          <h2 className="section-title">Meet our <span>Team</span></h2>
          <p className="dev-subtitle">Tim multidisiplin yang berdedikasi membangun solusi AI terbaik untuk petani Indonesia.</p>

          <div className="dev-row">
            {teamMembers.map((m, i) => (
              <div
                className="dev-card-h"
                key={i}
                style={{ animationDelay: `${i * 0.12}s` }}
              >
                {/* avatar */}
                <div className="dev-avatar-wrap">
                  {m.photo ? (
                    <img src={m.photo} alt={m.name} className="dev-avatar-photo" />
                  ) : (
                    <div className="dev-avatar-letter" style={{ background: m.color + '20', color: m.color }}>
                      {m.initials}
                    </div>
                  )}
                  <span className="dev-status-dot" style={{ background: m.color }}></span>
                </div>

                {/* info */}
                <div className="dev-info">
                  <b className="dev-fullname">{m.name}</b>
                  <span className="dev-badge" style={{ background: m.color + '18', color: m.color }}>
                    <i className={`ph ${m.icon}`}></i> {m.role}
                  </span>
                </div>

                {/* animated ring */}
                <span className="dev-ring" style={{ borderColor: m.color + '40' }}></span>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* ── FOOTER ── */}
      <footer className="footer-box">
        <div className="footer-top">
          <div className="footer-brand">
            <img src={farmBg} alt="" style={{height:30,width:50,objectFit:'cover',borderRadius:8,opacity:.7}}/>
            <span className="footer-brand-name">RiceCare AI</span>
            <p className="footer-brand-desc">Platform AI untuk deteksi penyakit tanaman padi menggunakan CNN. Membantu petani Indonesia lebih produktif.</p>
            <div className="footer-social">
              <a href="#"><i className="ph ph-instagram-logo"></i></a>
              <a href="#"><i className="ph ph-twitter-logo"></i></a>
              <a href="#"><i className="ph ph-github-logo"></i></a>
              <a href="#"><i className="ph ph-envelope-simple"></i></a>
            </div>
          </div>
          <div className="footer-col">
            <h5>Fitur</h5>
            <a href="#"><i className="ph ph-camera" style={{marginRight:6}}></i>Deteksi Penyakit</a>
            <a href="#"><i className="ph ph-clock" style={{marginRight:6}}></i>Riwayat Scan</a>
            <a href="#"><i className="ph ph-shield" style={{marginRight:6}}></i>Penanganan</a>
            <a href="#info-ai"><i className="ph ph-info" style={{marginRight:6}}></i>Info Model AI</a>
          </div>
          <div className="footer-col">
            <h5>Platform</h5>
            <a href="#">Tentang Kami</a>
            <a href="#">Kebijakan Privasi</a>
            <a href="#">Syarat & Ketentuan</a>
            <a href="#">Kontak</a>
          </div>
        </div>
        <div className="footer-bottom">
          <p className="footer-copy">© 2025 RiceCare AI. Dibuat untuk petani Indonesia.</p>
          <p className="footer-copy">Powered by RiceCare AI </p>
        </div>
      </footer>
    </div>
  );
}
