import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import farmBg from '../assets/fram-padi.jpg';
import registerImg from '../assets/images/tutorial/register.png';
import scanImg from '../assets/images/tutorial/scan.png';
import hasilScanImg from '../assets/images/tutorial/hasil-scan.png';
import penangananImg from '../assets/images/tutorial/penaganan.png';
import putriImg from '../assets/images/teams/putri.jpeg';
import febiImg from '../assets/images/teams/febi.jpeg';
import fransImg from '../assets/images/teams/Frans.jpeg';
import wegaImg from '../assets/images/teams/wega.jpeg';
import rifaImg from '../assets/images/teams/rifa.jpg';
import nisaImg from '../assets/images/teams/nisa.jpeg';

const langkah = [
  {
    title: 'Buat Akun',
    img: registerImg,
    desc: 'Daftar akun terlebih dahulu untuk menggunakan fitur RiceCare AI secara penuh.',
  },
  {
    title: 'Scan Daun Padi',
    img: scanImg,
    desc: 'Unggah atau ambil foto langsung dari kamera untuk memulai deteksi penyakit tanaman.',
  },
  {
    title: 'Lihat Hasil AI',
    img: hasilScanImg,
    desc: 'Sistem akan menampilkan hasil diagnosa beserta tingkat keyakinan AI.',
  },
  {
    title: 'Terapkan Penanganan',
    img: penangananImg,
    desc: 'Baca solusi dan panduan penanganan penyakit padi secara lengkap dan terperinci.',
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
    photo: putriImg,
    name: 'Putri Dwi R',
    role: 'Fullstack',
    icon: 'ph-code',
    color: '#38bdf8',
    social: [
      { label: 'Instagram', href: 'https://www.instagram.com/ptriidwirlyh?igsh=MXI1NmZrYWxvbHp2OQ==', icon: 'ph-instagram-logo' },
      { label: 'LinkedIn', href:'https://www.linkedin.com/in/putri-dwi-roliyah-4bba513a7', icon: 'ph-linkedin-logo' },
      { label: 'Email', href: 'mailto:putridwiroliyah26@gmail.com', icon: 'ph-envelope-simple' }
    ]
  },
  {
    photo: febiImg,
    name: 'Febi Bahtiyar',
    role: 'Fullstack',
    icon: 'ph-code',
    color: '#38bdf8',
    social: [
      { label: 'Instagram', href: 'https://www.instagram.com/effuture?igsh=MWphbXQ5NnE3bHJ3NA==', icon: 'ph-instagram-logo' },
      { label: 'LinkedIn', href: 'https://www.linkedin.com/in/febi-bahtiyar-2a37a8277', icon: 'ph-linkedin-logo' },
      { label: 'Email', href: 'mailto:febibahtiyar@gmail.com', icon: 'ph-envelope-simple' }
    ]
  },
  {
    photo: fransImg,
    name: 'Fransiskus W',
    role: 'AI Engineer',
    icon: 'ph-brain',
    color: '#34d399',
    initials: 'FW',
    social: [
      { label: 'Instagram', href: 'https://www.instagram.com/sesko_wutuk?igsh=MzFmbGhlbzRieHo0', icon: 'ph-instagram-logo' },
      { label: 'LinkedIn', href: 'https://www.linkedin.com/in/fransiskus-wutuk', icon: 'ph-linkedin-logo' },
      { label: 'Email', href: 'mailto:fransiskuswutuk24@gmail.com', icon: 'ph-envelope-simple' }
    ]
  },
  {
    photo: wegaImg,
    name: 'Wega Pratiwi',
    role: 'AI Engineer',
    icon: 'ph-cpu',
    color: '#34d399',
    initials: 'WP',
    social: [
      { label: 'Instagram', href: 'https://www.instagram.com/luckylighttt?igsh=aHM3dHF2bXZ5dDdz', icon: 'ph-instagram-logo' },
      { label: 'LinkedIn', href: 'https://www.linkedin.com/in/wega-pratiwi-174744330/', icon: 'ph-linkedin-logo' },
      { label: 'Email', href: 'mailto:wega7928@gmail.com', icon: 'ph-envelope-simple' }
    ]
  },
  {
    photo: rifaImg,
    name: 'Rifa Agnia',
    role: 'Data Science',
    icon: 'ph-chart-line-up',
    color: '#fb923c',
    initials: 'RA',
    social: [
      { label: 'Instagram', href: 'https://www.instagram.com/rifaagni_?igsh=ZWxneWNoZnNwdXAw', icon: 'ph-instagram-logo' },
      { label: 'LinkedIn', href: 'https://www.linkedin.com/in/rifa-agnia-3850a5249', icon: 'ph-linkedin-logo' },
      { label: 'Email', href: 'mailto:rifnia04@gmail.com', icon: 'ph-envelope-simple' }
    ]
  },
  {
    photo: nisaImg,
    name: 'Nisa Nuraini',
    role: 'Data Science',
    icon: 'ph-database',
    color: '#fb923c',
    initials: 'NN',
    social: [
      { label: 'Instagram', href: 'https://www.instagram.com/nisa.nrn?igsh=N3R3d2J5MXBjdmcz', icon: 'ph-instagram-logo' },
      { label: 'LinkedIn', href: 'https://www.linkedin.com/in/nisa-nuraini-826026289/', icon: 'ph-linkedin-logo' },
      { label: 'Email', href: 'mailto:nurainisa28@gmail.com', icon: 'ph-envelope-simple' }
    ]
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
              <a className="btn-hero-secondary" href="#panduan">
                <i className="ph ph-play-circle"></i> Cara Pakai
              </a>
            </div>
            <div className="hero-stats-row">
              <div className="hero-stat">
                <div className="num">5K<span>+</span></div>
                <div className="lbl">Dataset Citra</div>
              </div>
              <div className="hero-stat">
                <div className="num">90<span>%</span></div>
                <div className="lbl">Akurasi Model</div>
              </div>
              <div className="hero-stat">
                <div className="num">4</div>
                <div className="lbl">kategori</div>
              </div>
            </div>
          </div>
          <div className="hero-right">
            <img src={farmBg} alt="Tanaman Padi" />
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section className="feature-section" id="fitur" ref={addReveal}>
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
        <section className="cara-section" id="panduan" ref={addReveal}>
          <div className="section-label">
            <i className="ph ph-map-trifold"></i> Panduan
          </div>
          <h2 className="section-title">Cara <span>Penggunaan</span></h2>
          {/* Horizontal scroll layout */}
          <div className="cara-grid">
            {langkah.map((l, i) => (
              <div key={i} className="cara-step-simple">
                <div className="cara-step-img">
                  <img src={l.img} alt={l.title} />
                </div>
                <div className="cara-step-content">
                  <div className="cara-step-num-simple">{i + 1}</div>
                  <h4 className="cara-step-title-simple">{l.title}</h4>
                  <p className="cara-step-desc">{l.desc}</p>
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
              <p>Confidence AI di atas 85% untuk memastikan hasil diagnosis yang dapat diandalkan petani.</p>
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
        <section className="dev-section" id="team" ref={addReveal}>
          <div className="section-label">
            <i className="ph ph-users-three"></i> Kolaborasi
          </div>
          <h2 className="section-title"><span>Team</span></h2>
          <p className="dev-subtitle">Membangun solusi untuk petani Indonesia.</p>
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

                {/* contact icons */}
                <div className="dev-social-row">
                  {m.social.map((item, idx) => (
                    <a
                      key={idx}
                      href={item.href}
                      aria-label={`${m.name} ${item.label}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <i className={`ph ${item.icon}`}></i>
                    </a>
                  ))}
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
            {/* <img src={img} alt="" style={{height:30,width:50,objectFit:'cover',borderRadius:8,opacity:.7}}/> */}
            <span className="footer-brand-name">RiceCare AI</span>
            <p className="footer-brand-desc">Platform AI untuk deteksi penyakit tanaman padi. Membantu petani Indonesia lebih produktif.</p>
            {/* <div className="footer-social">
              <a href="#"><i className="ph ph-instagram-logo"></i></a>
              <a href="#"><i className="ph ph-github-logo"></i></a>
              <a href="#"><i className="ph ph-envelope-simple"></i></a>
            </div> */}
          </div>
          <div className="footer-col">
            <h5>Fitur</h5>
            <a href="#"><i className="ph ph-camera" style={{marginRight:6}}></i>Deteksi Penyakit</a>
            <a href="#"><i className="ph ph-clock" style={{marginRight:6}}></i>Riwayat Scan</a>
            <a href="#"><i className="ph ph-shield" style={{marginRight:6}}></i>Penanganan</a>
          </div>
          <div className="footer-col">
            <h5>Platform</h5>
            <a href="#">Tentang Kami</a>
            <a href="#">Kebijakan Privasi</a>
            <a href="#">Syarat & Ketentuan</a>
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
