import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import { DISEASE_INFO } from '../services/aiService';
import farmBg from '../assets/fram-padi.jpg';

export default function DetailPenanganan() {
  const { state } = useLocation();
  const navigate = useNavigate();

  // Gunakan data dari state navigasi, atau fallback ke brownspot
  const disease = state?.disease || { key: 'brownspot', ...DISEASE_INFO.brownspot };
  const info = DISEASE_INFO[disease.key] || DISEASE_INFO.brownspot;

  const treatments = disease.treatments?.length ? disease.treatments : info.treatments;
  const preventions = disease.preventions?.length ? disease.preventions : info.preventions;
  const description = disease.description || info.description;

  const severityColor = { none: '#16a34a', low: '#16a34a', medium: '#d97706', high: '#dc2626' };
  const color = severityColor[disease.severity] || '#16a34a';

  return (
    <div className="page-shell">
      <Navbar />
      <main className="detail-main">

        <h1>Solusi Penanganan Penyakit</h1>
        <div className="detail-layout">
          <div className="detail-image-card">
            <img src={farmBg} alt={disease.name} />
            <div style={{padding:'16px 0 0'}}>
              <h2 style={{margin:'8px 0 4px',fontSize:22}}>{disease.name || info.label}</h2>
              <span style={{background:`${color}18`,color,borderRadius:100,padding:'3px 12px',fontSize:12,fontWeight:700}}>
                {disease.severity === 'high' ? 'Risiko Tinggi' : disease.severity === 'medium' ? 'Risiko Sedang' : disease.severity === 'none' ? 'Tidak ada penyakit' : 'Risiko Rendah'}
              </span>
              {disease.latinName && <p style={{fontSize:12,color:'#6b7c6b',fontStyle:'italic',marginTop:8}}>{disease.latinName}</p>}
            </div>
          </div>

          <div className="detail-content-card">
            <section>
              <h3><i className="bi bi-leaf-fill"></i> Penjelasan</h3>
              <p>{description}</p>
            </section>

            {disease.symptoms?.length > 0 && (
              <section>
                <h3><i className="bi bi-exclamation-triangle-fill"></i> Gejala</h3>
                <ul>{disease.symptoms.map((s, i) => <li key={i}>{s}</li>)}</ul>
              </section>
            )}

            <section>
              <h3><i className="bi bi-shield-fill-plus"></i> Penanganan</h3>
              <ol>{treatments.map((t, i) => <li key={i}>{t}</li>)}</ol>
            </section>

            <section>
              <h3><i className="bi bi-shield-check"></i> Pencegahan</h3>
              <ul>{preventions.map((p, i) => <li key={i}>{p}</li>)}</ul>
            </section>
          </div>
        </div>
      </main>
      <footer className="footer-box"><p><b>© RiceCareAi</b> - Powered by MobileNetV2 & Claude AI</p></footer>
    </div>
  );
}
