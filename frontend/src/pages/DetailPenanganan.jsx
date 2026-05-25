import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import { DISEASE_INFO } from '../services/aiService';
import farmBg from '../assets/fram-padi.jpg';

const Footer = () => (
  <footer className="footer-box">
    <div className="footer-bottom" style={{borderTop:'none',paddingTop:0,width:'100%',justifyContent:'center',flexDirection:'column',gap:4,textAlign:'center'}}>
      <p className="footer-copy">© 2025 RiceCare AI </p>
    </div>
  </footer>
);

const sevConfig = {
  none:   { label:'Tidak Ada Penyakit', color:'#16a34a', bg:'#f0fdf4' },
  low:    { label:'Risiko Rendah',      color:'#16a34a', bg:'#f0fdf4' },
  medium: { label:'Risiko Sedang',      color:'#d97706', bg:'#fffbeb' },
  high:   { label:'Risiko Tinggi',      color:'#dc2626', bg:'#fef2f2' },
};

export default function DetailPenanganan() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const disease = state?.disease || { key: 'brownspot', ...DISEASE_INFO.brownspot };
  const info = DISEASE_INFO[disease.key] || DISEASE_INFO.brownspot;
  const treatments = disease.treatments?.length ? disease.treatments : info.treatments;
  const preventions = disease.preventions?.length ? disease.preventions : info.preventions;
  const description = disease.description || info.description;
  const sev = sevConfig[disease.severity] || sevConfig.low;

  const imageSrc = disease.image || farmBg;

  return (
    <div className="page-shell">
      <Navbar />
      <main className="detail-main">
        <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:24}}>
          <button
            type="button"
            onClick={() => navigate(-1)}
            style={{display:'flex',alignItems:'center',gap:7,background:'var(--off-white)',border:'1.5px solid var(--gray-200)',borderRadius:'var(--radius-pill)',padding:'8px 16px',fontSize:13,fontWeight:700,cursor:'pointer',color:'var(--black)'}}
          >
            <i className="ph ph-arrow-left"></i> Kembali
          </button>
          <div style={{fontSize:12,color:'var(--gray-400)'}}>Penanganan / {disease.name}</div>
        </div>

        <h1>Solusi Penanganan</h1>
        <div className="detail-layout">
          <div className="detail-image-card">
            <img src={imageSrc} alt={disease.name} />
            <div>
              <h2 style={{fontSize:22,fontWeight:800,marginTop:8,marginBottom:6}}>{disease.name || info.label}</h2>
              <p style={{fontSize:13,color:'var(--gray-600)',lineHeight:1.6,marginTop:12,marginBottom:0}}>{description}</p>
              {disease.latinName && <p style={{fontSize:12,color:'var(--gray-400)',fontStyle:'italic',marginTop:10}}>{disease.latinName}</p>}
            </div>
          </div>

          <div className="detail-content-card">
            {disease.symptoms?.length > 0 && (
              <section>
                <h3><i className="ph ph-warning-circle"></i> Gejala</h3>
                <ul>{disease.symptoms.map((s, i) => <li key={i}>{s}</li>)}</ul>
              </section>
            )}

            <section>
              <h3><i className="ph ph-first-aid"></i> Langkah Penanganan</h3>
              <ol>{treatments.map((t, i) => <li key={i}>{t}</li>)}</ol>
            </section>

            <section>
              <h3><i className="ph ph-shield-check"></i> Pencegahan</h3>
              <ul>{preventions.map((p, i) => <li key={i}>{p}</li>)}</ul>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
