import { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/Navbar.jsx';
import { getMyScans, deleteScan } from '../services/scanService';
import { DISEASE_INFO } from '../services/aiService';

const BASE_URL = import.meta.env.VITE_API_URL?.replace('/api/v1', '') || 'http://localhost:5000';

const Footer = () => (
  <footer className="footer-box">
    <div className="footer-bottom" style={{borderTop:'none',paddingTop:0,width:'100%',justifyContent:'center',flexDirection:'column',gap:4,textAlign:'center'}}>
      <p className="footer-copy">© 2025 RiceCare AI</p>
    </div>
  </footer>
);

export default function Riwayat() {
  const [scans, setScans] = useState([]);
  const [meta, setMeta] = useState({ page: 1, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterDiagnosis, setFilterDiagnosis] = useState('');
  const [page, setPage] = useState(1);
  const [deleting, setDeleting] = useState(null);

  const fetchScans = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const { scans: data, meta: m } = await getMyScans({ page, limit: 9, diagnosis: filterDiagnosis || undefined });
      setScans(data); setMeta(m);
    } catch (err) {
      setError('Gagal memuat riwayat: ' + (err.response?.data?.message || err.message));
    } finally { setLoading(false); }
  }, [page, filterDiagnosis]);

  useEffect(() => { fetchScans(); }, [fetchScans]);

  const handleDelete = async (id) => {
    if (!confirm('Hapus data scan ini?')) return;
    setDeleting(id);
    try {
      await deleteScan(id);
      setScans(prev => prev.filter(s => s._id !== id));
      setMeta(prev => ({ ...prev, total: prev.total - 1 }));
    } catch { alert('Gagal menghapus scan.'); }
    finally { setDeleting(null); }
  };

  const handleFilterChange = (d) => { setFilterDiagnosis(d); setPage(1); };

  const filterOptions = [
    { key: '', label: 'Semua Scan', icon: 'ph-list' },
    { key: 'sehat', label: 'Sehat', icon: DISEASE_INFO.sehat?.icon || 'ph-leaf' },
    { key: 'blast', label: 'Blast', icon: DISEASE_INFO.blast?.icon || 'ph-warning' },
    { key: 'tungro', label: 'Tungro', icon: DISEASE_INFO.tungro?.icon || 'ph-bug' },
    { key: 'brownspot', label: 'Brown Spot', icon: DISEASE_INFO.brownspot?.icon || 'ph-warning-circle' },
  ];

  return (
    <div className="page-shell">
      <Navbar />
      <main className="cards-main">
        <div className="page-header">
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:12}}>
            <div>
              <div className="section-label" style={{marginBottom:8}}>
                <i className="ph ph-clock-counter-clockwise"></i> Riwayat
              </div>
              <h1>Riwayat Deteksi</h1>
              <p style={{color:'var(--gray-600)',fontSize:14,marginTop:4}}>
                Total <b style={{color:'var(--green-600)'}}>{meta.total}</b> hasil scan tersimpan
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="filter-chips">
          {filterOptions.map(f => (
            <button
              key={f.key}
              className={`filter-chip ${filterDiagnosis === f.key ? 'active' : ''}`}
              onClick={() => handleFilterChange(f.key)}
              type="button"
            >
              <i className={`ph ${f.icon}`}></i> {f.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="loading-ring"></div>
            <p style={{color:'var(--gray-600)',fontSize:14,fontWeight:600}}>Memuat riwayat...</p>
          </div>
        ) : error ? (
          <div style={{display:'flex',alignItems:'center',gap:10,background:'#fef2f2',border:'1.5px solid #fca5a5',color:'#dc2626',borderRadius:'var(--radius-lg)',padding:'16px 20px',fontSize:14,fontWeight:600}}>
            <i className="ph ph-warning-circle" style={{fontSize:20}}></i>
            {error}
            <button style={{marginLeft:'auto',background:'transparent',border:'1.5px solid #dc2626',color:'#dc2626',borderRadius:'var(--radius-pill)',padding:'6px 14px',fontSize:13,fontWeight:700,cursor:'pointer'}} onClick={fetchScans}>Coba Lagi</button>
          </div>
        ) : scans.length === 0 ? (
          <div className="empty-state">
            <i className="ph ph-inbox" style={{fontSize:56,color:'var(--gray-200)',display:'block',marginBottom:16}}></i>
            <p>Belum ada riwayat scan{filterDiagnosis ? ` untuk "${DISEASE_INFO[filterDiagnosis]?.label}"` : ''}.</p>
            <a href="/scan" style={{display:'inline-flex',alignItems:'center',gap:7,background:'var(--green-500)',color:'#fff',borderRadius:'var(--radius-pill)',padding:'10px 22px',fontSize:14,fontWeight:800,marginTop:16,textDecoration:'none'}}>
              <i></i> Mulai Scan
            </a>
          </div>
        ) : (
          <div className="result-grid">
            {scans.map((scan) => {
              const info = DISEASE_INFO[scan.diagnosis] || DISEASE_INFO.sehat;
              const imgUrl = scan.imageUrl ? `${BASE_URL}${scan.imageUrl}` : null;
              return (
                <div className="result-card" key={scan._id}>
                  {imgUrl
                    ? <img src={imgUrl} alt={info.label} onError={e => e.target.style.display='none'} />
                    : <div style={{height:160,background:'var(--green-50)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:40}}>
                        <i className={`ph ${info.icon}`} style={{ color: info.iconColor || info.severityColor, fontSize: 44 }}></i>
                      </div>
                  }
                  <div className="result-card-body">
                    <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:10}}>
                      <span className="result-card-icon" style={{background: info.iconBg || 'var(--gray-100)', color: info.iconColor || info.severityColor}}>
                        <i className={`ph ${info.icon}`} style={{fontSize:18}}></i>
                      </span>
                      <h3 style={{margin:0}}>{info.label}</h3>
                    </div>
                    <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:8}}>
                      <span className="confidence">
                        <i className="ph ph-chart-bar"></i> {Math.round(scan.topConfidence)}% Keyakinan
                      </span>
                    </div>
                    <span style={{fontSize:12,color:'var(--gray-400)',display:'flex',alignItems:'center',gap:5}}>
                      <i className="ph ph-calendar-blank"></i>
                      {new Date(scan.createdAt).toLocaleDateString('id-ID',{day:'2-digit',month:'short',year:'numeric'})}
                    </span>
                    <button
                      style={{marginTop:'auto',paddingTop:12,display:'flex',alignItems:'center',gap:6,background:'transparent',border:'1.5px solid #fca5a5',color:'#e03c3c',borderRadius:'var(--radius-pill)',padding:'8px 16px',fontSize:12,fontWeight:700,cursor:'pointer',transition:'var(--transition)',width:'100%',justifyContent:'center',marginTop:14}}
                      onClick={() => handleDelete(scan._id)}
                      disabled={deleting === scan._id}
                      type="button"
                    >
                      {deleting === scan._id
                        ? <span className="spinner-border spinner-border-sm"></span>
                        : <><i className="ph ph-trash"></i> Hapus</>
                      }
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {meta.totalPages > 1 && (
          <div className="pagination-row">
            <button className="page-btn" disabled={page <= 1} onClick={() => setPage(p => p-1)} type="button">
              <i className="ph ph-caret-left"></i>
            </button>
            {Array.from({length: meta.totalPages}, (_, i) => i+1).map(p => (
              <button key={p} className={`page-btn ${page===p?'active':''}`} onClick={()=>setPage(p)} type="button">{p}</button>
            ))}
            <button className="page-btn" disabled={page >= meta.totalPages} onClick={() => setPage(p => p+1)} type="button">
              <i className="ph ph-caret-right"></i>
            </button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
