import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import { getCurrentUser, isLoggedIn } from '../services/authService';
import api from '../services/api';

const Footer = () => (
  <footer className="footer-box" style={{marginTop:0}}>
    <div className="footer-bottom" style={{borderTop:'none',paddingTop:0,justifyContent:'center',flexDirection:'column',gap:4,textAlign:'center'}}>
      <p className="footer-copy">© 2025 RiceCare AI — Semua hak dilindungi</p>
    </div>
  </footer>
);

export default function Profil() {
  const navigate = useNavigate();
  const user = getCurrentUser();

  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '' });
  const [passForm, setPassForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [passLoading, setPassLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [passError, setPassError] = useState('');
  const [passSuccess, setPassSuccess] = useState('');
  const [stats, setStats] = useState({ totalScan: 0, terdeteksi: 0, sehat: 0 });

  useEffect(() => {
    if (!isLoggedIn()) navigate('/login');
  }, [navigate]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/scans/stats/summary');
        const { totalScans, breakdown } = data.data;
        setStats({
          totalScan: totalScans,
          terdeteksi: totalScans - (breakdown.sehat || 0),
          sehat: breakdown.sehat || 0,
        });
      } catch (err) {
        console.error('Failed to fetch stats:', err);
        // Keep default values if error
      }
    };
    fetchStats();
  }, []);

  const firstLetter = form.name?.[0]?.toUpperCase() || '?';

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handlePassChange = (e) => setPassForm({ ...passForm, [e.target.name]: e.target.value });

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!form.name || !form.email) { setError('Nama dan email wajib diisi.'); return; }
    setLoading(true);
    try {
      const { data } = await api.patch('/users/profile', {
        name: form.name,
        email: form.email,
      });
      const updatedUser = data.data?.user || { name: form.name, email: form.email };
      localStorage.setItem('ricecare_user', JSON.stringify(updatedUser));
      setForm((prev) => ({ ...prev, name: updatedUser.name, email: updatedUser.email }));
      setSuccess('Profil berhasil diperbarui!');
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal memperbarui profil.');
    } finally { setLoading(false); }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPassError(''); setPassSuccess('');
    if (!passForm.currentPassword || !passForm.newPassword) { setPassError('Semua field wajib diisi.'); return; }
    if (passForm.newPassword.length < 6) { setPassError('Password baru minimal 6 karakter.'); return; }
    if (passForm.newPassword !== passForm.confirmPassword) { setPassError('Konfirmasi password tidak cocok.'); return; }
    setPassLoading(true);
    try {
      await api.patch('/auth/change-password', {
        oldPassword: passForm.currentPassword,
        newPassword: passForm.newPassword
      });
      setPassSuccess('Password berhasil diubah!');
      setPassForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPassError(err.response?.data?.message || 'Gagal mengubah password.');
    } finally { setPassLoading(false); }
  };

  return (
    <div className="page-shell">
      <Navbar />
      <main className="profile-main">

        {/* Header card */}
        <div className="profile-header-card">
          <div className="profile-avatar">{firstLetter}</div>
          <div className="profile-header-info">
            <h2>{form.name || 'Petani'}</h2>
            <p><i className="ph ph-envelope" style={{marginRight:5}}></i>{form.email}</p>
            {/* <span className="profile-chip">
              <i className="ph ph-check-circle"></i> Akun Aktif
            </span> */}
          </div>
        </div>

        {/* Stats */}
        <div className="profile-stats-grid">
          {[
            {num: stats.totalScan, label:'Total Scan',icon:'ph-scan'},
            {num: stats.terdeteksi, label:'Terdeteksi',icon:'ph-warning'},
            {num: stats.sehat, label:'Sehat',icon:'ph-leaf'},
          ].map((s,i)=>(
            <div key={i} className="profile-stat-card">
              <div style={{fontSize:22,marginBottom:6}}><i className={`ph ${s.icon}`} style={{color:'var(--green-500)'}}></i></div>
              <div className="psc-num">{s.num}</div>
              <div className="psc-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Edit profil */}
        <div className="profile-card">
          <h3><i className="ph ph-user-circle"></i> Edit Profil</h3>

          {success && (
            <div className="success-toast">
              <i className="ph ph-check-circle"></i> {success}
            </div>
          )}
          {error && (
            <div style={{display:'flex',alignItems:'center',gap:8,background:'#fef2f2',border:'1.5px solid #fca5a5',color:'#dc2626',borderRadius:'var(--radius-md)',padding:'12px 14px',fontSize:13,fontWeight:600,marginBottom:16}}>
              <i className="ph ph-warning-circle"></i> {error}
            </div>
          )}

          <form onSubmit={handleSaveProfile}>
            <div className="form-input-row">
              <div className="form-field">
                <label><i className="ph ph-user" style={{marginRight:5,color:'var(--green-600)'}}></i>Nama Lengkap</label>
                <input className="form-input" type="text" name="name" value={form.name} onChange={handleChange} placeholder="Nama lengkap Anda" required />
              </div>
              <div className="form-field">
                <label><i className="ph ph-envelope" style={{marginRight:5,color:'var(--green-600)'}}></i>Email</label>
                <input className="form-input" type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email Anda" required />
              </div>
            </div>
            <div style={{display:'flex',gap:12,alignItems:'center',flexWrap:'wrap'}}>
              <button className="btn-save" type="submit" disabled={loading}>
                {loading
                  ? <><span className="spinner-border spinner-border-sm"></span> Menyimpan...</>
                  : <><i className="ph ph-floppy-disk"></i> Simpan Perubahan</>
                }
              </button>
            </div>
          </form>
        </div>

        {/* Ganti password */}
        <div className="profile-card">
          <h3><i className="ph ph-lock-key"></i> Ganti Password</h3>

          {passSuccess && (
            <div className="success-toast">
              <i className="ph ph-check-circle"></i> {passSuccess}
            </div>
          )}
          {passError && (
            <div style={{display:'flex',alignItems:'center',gap:8,background:'#fef2f2',border:'1.5px solid #fca5a5',color:'#dc2626',borderRadius:'var(--radius-md)',padding:'12px 14px',fontSize:13,fontWeight:600,marginBottom:16}}>
              <i className="ph ph-warning-circle"></i> {passError}
            </div>
          )}

          <form onSubmit={handleChangePassword}>
            <div className="form-field">
              <label><i className="ph ph-lock" style={{marginRight:5,color:'var(--green-600)'}}></i>Password Saat Ini</label>
              <input className="form-input" type="password" name="currentPassword" value={passForm.currentPassword} onChange={handlePassChange} placeholder="Masukkan password lama" required />
            </div>
            <div className="form-input-row">
              <div className="form-field">
                <label><i className="ph ph-lock-key" style={{marginRight:5,color:'var(--green-600)'}}></i>Password Baru</label>
                <input className="form-input" type="password" name="newPassword" value={passForm.newPassword} onChange={handlePassChange} placeholder="Min. 6 karakter" required />
              </div>
              <div className="form-field">
                <label><i className="ph ph-lock-key-open" style={{marginRight:5,color:'var(--green-600)'}}></i>Konfirmasi Password Baru</label>
                <input className="form-input" type="password" name="confirmPassword" value={passForm.confirmPassword} onChange={handlePassChange} placeholder="Ulangi password baru" required />
              </div>
            </div>
            <button className="btn-save" type="submit" disabled={passLoading}>
              {passLoading
                ? <><span className="spinner-border spinner-border-sm"></span> Mengubah...</>
                : <><i className="ph ph-lock-key"></i> Ubah Password</>
              }
            </button>
          </form>
        </div>

        {/* Danger zone */}
        <div className="profile-card" style={{borderColor:'#fca5a5'}}>
          <h3 style={{color:'#e03c3c'}}><i className="ph ph-warning" style={{color:'#e03c3c'}}></i> Zona Berbahaya</h3>
          <p style={{fontSize:14,color:'var(--gray-600)',marginBottom:20}}>Aksi berikut bersifat permanen dan tidak bisa dibatalkan.</p>
          <button className="btn-outline-danger-custom" type="button" onClick={()=>{if(confirm('Yakin ingin logout dari semua perangkat?')) navigate('/login');}}>
            <i className="ph ph-sign-out"></i> Logout dari Semua Perangkat
          </button>
        </div>

      </main>
      <Footer />
    </div>
  );
}
