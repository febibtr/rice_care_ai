import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import farmBg from '../assets/fram-padi.jpg';

export default function Landing() {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('ricecare_auth') === 'true';

  const goToScan = () => {
    navigate(isLoggedIn ? '/scan' : '/register');
  };

  return (
    <div className="page-shell">
      <Navbar />

      <main className="landing-main">
        <section className="hero-section-custom">
          <div className="hero-image-card">
            <img src={farmBg} alt="Tanaman padi" />
          </div>

          <div className="hero-content">
            <h1>RiceCare Ai Sahabat Petani</h1>
            <p>
              Platform RiceAi dirancang untuk mendukung proses scan, riwayat pemeriksaan,
              dan rekomendasi penanganan tanaman padi secara lebih mudah.
            </p>
            <button className="black-pill" onClick={goToScan} type="button">
              Mulai <i className="bi bi-arrow-right"></i>
            </button>
          </div>
        </section>

        <section className="feature-grid">
          <button className="feature-card" onClick={goToScan} type="button">
            <i className="bi bi-camera"></i>
            <h5>Deteksi</h5>
            <p>Unggah atau ambil foto tanaman untuk pemeriksaan awal pada tanaman padi.</p>
          </button>

          <button className="feature-card" onClick={() => navigate(isLoggedIn ? '/riwayat' : '/register')} type="button">
            <i className="bi bi-clock-history"></i>
            <h5>Riwayat</h5>
            <p>Menyimpan data hasil pemeriksaan agar mudah dilihat kembali.</p>
          </button>

          <button className="feature-card" onClick={() => navigate(isLoggedIn ? '/penanganan' : '/register')} type="button">
            <i className="bi bi-shield-check"></i>
            <h5>Penanganan</h5>
            <p>Memberikan arahan penanganan berdasarkan masalah yang ditemukan.</p>
          </button>
        </section>
      </main>

      <footer className="footer-box">
        <p><b>© RiceCareAi</b> - Frontend awal untuk pengembangan aplikasi.</p>
        <span>Designed by</span>
      </footer>
    </div>
  );
}
