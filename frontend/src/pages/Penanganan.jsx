import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import blastImg from '../assets/images/penyakit/blast.jpg';
import brownspotImg from '../assets/images/penyakit/brownspot.jpg';
import tungroImg from '../assets/images/penyakit/tunggro.jpg';
import farmBg from '../assets/fram-padi.jpg';
import { getAllDiseases } from '../services/diseaseService';
import { DISEASE_INFO } from '../services/aiService';

const Footer = () => (
  <footer className="footer-box">
    <div className="footer-bottom" style={{borderTop:'none',paddingTop:0,width:'100%',justifyContent:'center',flexDirection:'column',gap:4,textAlign:'center'}}>
      <p className="footer-copy">© 2025 RiceCare AI</p>
    </div>
  </footer>
);

const severityConfig = {
  none:   { label: 'Tidak Ada Penyakit', color: '#16a34a', bg: '#f0fdf4', icon: 'ph-check-circle' },
  low:    { label: 'Risiko Rendah',      color: '#16a34a', bg: '#f0fdf4', icon: 'ph-arrow-circle-down' },
  medium: { label: 'Risiko Sedang',      color: '#d97706', bg: '#fffbeb', icon: 'ph-minus-circle' },
  high:   { label: 'Risiko Tinggi',      color: '#dc2626', bg: '#fef2f2', icon: 'ph-warning-circle' },
};

export default function Penanganan() {
  const navigate = useNavigate();
  const [diseases, setDiseases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllDiseases()
      .then(setDiseases)
      .catch(() => {
        setDiseases(Object.entries(DISEASE_INFO).map(([key, d]) => ({
          key, name: d.label, emoji: d.emoji,
          severity: key === 'blast' ? 'high' : key === 'sehat' ? 'none' : 'medium',
          description: d.description, treatments: d.treatments, preventions: d.preventions,
        })));
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-shell">
      <Navbar />
      <main className="cards-main">
        <div className="page-header">
          <div className="section-label" style={{marginBottom:8}}>
            <i className="ph ph-shield-check"></i> Panduan
          </div>
          <h1>Penanganan Penyakit</h1>
          <p style={{color:'var(--gray-600)',fontSize:15,marginTop:6}}>
            Panduan identifikasi dan penanganan pada tanaman padi.
          </p>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="loading-ring"></div>
            <p style={{color:'var(--gray-600)',fontSize:14,fontWeight:600}}>Memuat data...</p>
          </div>
        ) : (
          <div className="result-grid">
            {diseases.map((disease) => {
              const sev = severityConfig[disease.severity] || severityConfig.low;
              const info = DISEASE_INFO[disease.key] || DISEASE_INFO.sehat;
              const diseaseImages = {
                blast: blastImg,
                brownspot: brownspotImg,
                tungro: tungroImg,
              };
              const imageSrc = disease.image || info.image || diseaseImages[disease.key] || farmBg;
              const mediaStyle = (!info.image && info.cardGradient) ? { background: info.cardGradient } : {};

              return (
                <button
                  className="treatment-card"
                  key={disease.key}
                  onClick={() => navigate('/penanganan/detail', { state: { disease: { ...disease, ...info, image: imageSrc } } })}
                  type="button"
                  style={{borderTop:`3px solid ${sev.color}`}}
                >
                  <div className="treatment-card-media" style={mediaStyle}>
                    <img className="treatment-card-media-img" src={imageSrc} alt={info.label} />
                  </div>
                  <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:12}}>
                    <span style={{background:sev.bg,color:sev.color,fontSize:11,fontWeight:700,padding:'4px 12px',borderRadius:'var(--radius-pill)',display:'inline-flex',alignItems:'center',gap:5}}>
                      <i className={`ph ${sev.icon}`}></i> {sev.label}
                    </span>
                  </div>
                  <h4 style={{fontSize:18,fontWeight:800,color:'var(--black)',marginBottom:10}}>{disease.name}</h4>
                  <p style={{fontSize:13,color:'var(--gray-600)',lineHeight:1.7,margin:0}}>
                    {disease.description?.slice(0, 120)}{disease.description?.length > 120 ? '...' : ''}
                  </p>
                  <div style={{display:'flex',alignItems:'center',gap:5,color:'var(--green-600)',fontSize:13,fontWeight:700,marginTop:'auto'}}>
                    <i className="ph ph-arrow-right"></i> Lihat selengkapnya
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
