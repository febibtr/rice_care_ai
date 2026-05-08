import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import { getAllDiseases } from '../services/diseaseService';
import { DISEASE_INFO } from '../services/aiService';

export default function Penanganan() {
  const navigate = useNavigate();
  const [diseases, setDiseases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllDiseases()
      .then(setDiseases)
      .catch(() => {
        // Fallback ke data statis jika API diseases kosong / belum di-seed
        setDiseases(Object.entries(DISEASE_INFO).map(([key, d]) => ({
          key, name: d.label, emoji: d.emoji,
          severity: key === 'blast' ? 'high' : key === 'sehat' ? 'none' : 'medium',
          description: d.description,
          treatments: d.treatments,
          preventions: d.preventions,
        })));
      })
      .finally(() => setLoading(false));
  }, []);

  const severityLabel = { none: 'Tidak ada penyakit', low: 'Risiko Rendah', medium: 'Risiko Sedang', high: 'Risiko Tinggi' };
  const severityColor = { none: '#16a34a', low: '#16a34a', medium: '#d97706', high: '#dc2626' };

  return (
    <div className="page-shell">
      <Navbar />
      <main className="cards-main">
        <h1>Penanganan Penyakit Daun Padi</h1>
        <p className="text-muted mb-4">Panduan identifikasi dan penanganan 4 kategori penyakit utama pada tanaman padi.</p>

        {loading ? (
          <div className="text-center py-5"><span className="spinner-border text-success"></span></div>
        ) : (
          <div className="result-grid">
            {diseases.map((disease) => {
              const info = DISEASE_INFO[disease.key] || {};
              const color = severityColor[disease.severity] || '#16a34a';
              return (
                <button
                  className="treatment-card"
                  key={disease.key}
                  onClick={() => navigate('/penanganan/detail', { state: { disease } })}
                  type="button"
                  style={{borderTop: `3px solid ${color}`}}
                >
                  <h4 style={{color:'#0d110d',marginBottom:6}}>{disease.name}</h4>
                  <span className="confidence" style={{background:`${color}18`,color,borderRadius:100,padding:'2px 10px',fontSize:11,fontWeight:600}}>
                    {severityLabel[disease.severity] || disease.severity}
                  </span>
                  <p style={{fontSize:13,color:'#4a5e4a',marginTop:10,lineHeight:1.6}}>
                    {disease.description?.slice(0, 100)}{disease.description?.length > 100 ? '...' : ''}
                  </p>
                  <span style={{fontSize:12,color:'#16a34a',marginTop:'auto'}}>Lihat detail →</span>
                </button>
              );
            })}
          </div>
        )}
      </main>
      <footer className="footer-box"><p><b>© RiceCareAi</b> - Powered by MobileNetV2 & Claude AI</p></footer>
    </div>
  );
}
