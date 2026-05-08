import { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/Navbar.jsx';
import { getMyScans, deleteScan } from '../services/scanService';
import { DISEASE_INFO } from '../services/aiService';

const BASE_URL = import.meta.env.VITE_API_URL?.replace('/api/v1', '') || 'http://localhost:5000';

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
    } finally {
      setLoading(false);
    }
  }, [page, filterDiagnosis]);

  useEffect(() => { fetchScans(); }, [fetchScans]);

  const handleDelete = async (id) => {
    if (!confirm('Hapus data scan ini?')) return;
    setDeleting(id);
    try {
      await deleteScan(id);
      setScans(prev => prev.filter(s => s._id !== id));
      setMeta(prev => ({ ...prev, total: prev.total - 1 }));
    } catch {
      alert('Gagal menghapus scan.');
    } finally { setDeleting(null); }
  };

  const handleFilterChange = (d) => { setFilterDiagnosis(d); setPage(1); };

  return (
    <div className="page-shell">
      <Navbar />
      <main className="cards-main">
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
          <h1 className="mb-0">Riwayat Deteksi</h1>
          <span className="text-muted small">Total: <b>{meta.total}</b> scan</span>
        </div>

        {/* Filter */}
        <div className="d-flex gap-2 flex-wrap mb-4">
          {['', 'sehat', 'blast', 'tungro', 'brownspot'].map(d => (
            <button key={d} type="button"
              className={`btn btn-sm ${filterDiagnosis === d ? 'btn-dark' : 'btn-outline-secondary'}`}
              onClick={() => handleFilterChange(d)}>
              {d ? (DISEASE_INFO[d]?.emoji + ' ' + DISEASE_INFO[d]?.label) : 'Semua'}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-5"><span className="spinner-border text-success"></span><p className="mt-2 text-muted small">Memuat riwayat...</p></div>
        ) : error ? (
          <div className="alert alert-danger">{error} <button className="btn btn-sm btn-outline-danger ms-2" onClick={fetchScans}>Coba lagi</button></div>
        ) : scans.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <i className="bi bi-inbox fs-1 d-block mb-3 opacity-25"></i>
            <p>Belum ada riwayat scan{filterDiagnosis ? ` untuk "${DISEASE_INFO[filterDiagnosis]?.label}"` : ''}.</p>
          </div>
        ) : (
          <div className="result-grid history-grid">
            {scans.map((scan) => {
              const info = DISEASE_INFO[scan.diagnosis] || DISEASE_INFO.sehat;
              const imgUrl = scan.imageUrl ? `${BASE_URL}${scan.imageUrl}` : null;
              return (
                <div className="result-card" key={scan._id} style={{position:'relative'}}>
                  {imgUrl
                    ? <img src={imgUrl} alt={info.label} style={{objectFit:'cover'}} onError={e => e.target.style.display='none'} />
                    : <div style={{height:140,background:'#f1f5f1',display:'flex',alignItems:'center',justifyContent:'center',fontSize:32}}>{info.emoji}</div>
                  }
                  <h3>{info.emoji} {info.label}</h3>
                  <span className="confidence">{Math.round(scan.topConfidence)}% Keyakinan</span>
                  <span className="d-block text-muted" style={{fontSize:'11px',marginTop:2}}>
                    {new Date(scan.createdAt).toLocaleDateString('id-ID',{day:'2-digit',month:'short',year:'numeric'})}
                  </span>
                  <button className="btn btn-sm btn-outline-danger mt-2 w-100" onClick={() => handleDelete(scan._id)} disabled={deleting === scan._id}>
                    {deleting === scan._id ? <span className="spinner-border spinner-border-sm"></span> : <><i className="bi bi-trash me-1"></i>Hapus</>}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {meta.totalPages > 1 && (
          <div className="d-flex justify-content-center gap-2 mt-4">
            <button className="btn btn-outline-secondary btn-sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>‹ Prev</button>
            <span className="btn btn-sm disabled">Hal {page} / {meta.totalPages}</span>
            <button className="btn btn-outline-secondary btn-sm" disabled={page >= meta.totalPages} onClick={() => setPage(p => p + 1)}>Next ›</button>
          </div>
        )}
      </main>
      <footer className="footer-box"><p><b>© RiceCareAi</b> - Powered by MobileNetV2 & Claude AI</p></footer>
    </div>
  );
}
