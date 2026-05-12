import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import farmBg from '../assets/fram-padi.jpg';
import { register } from '../services/authService';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault(); setError('');
    if (!form.name || !form.email || !form.password) { setError('Semua field wajib diisi.'); return; }
    if (form.password.length < 6) { setError('Password minimal 6 karakter.'); return; }
    if (form.password !== form.confirmPassword) { setError('Konfirmasi password tidak cocok.'); return; }
    setLoading(true);
    try {
      await register({ name: form.name, email: form.email, password: form.password });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registrasi gagal, coba lagi.');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-layout">
      <div className="auth-cover" style={{ backgroundImage: `linear-gradient(rgba(7,35,19,.72),rgba(7,35,19,.72)),url(${farmBg})` }}>
        <div style={{marginBottom:'auto',paddingTop:48}}>
          <div style={{display:'inline-flex',alignItems:'center',gap:8,background:'rgba(255,255,255,.1)',border:'1px solid rgba(255,255,255,.2)',borderRadius:999,padding:'6px 14px',color:'rgba(255,255,255,.8)',fontSize:13,fontWeight:700}}>
            <i className="ph ph-leaf"></i> RiceCare AI
          </div>
        </div>
        <div>
          <h1>Bergabung<br/>Bersama Kami</h1>
          <h4>Buat Akun Baru</h4>
          <p>Mulai gunakan RiceCare AI untuk membantu pemeriksaan dan perawatan tanaman padi Anda.</p>
          <div style={{marginTop:28,display:'flex',flexDirection:'column',gap:10}}>
            {[
              {icon:'ph-check-circle',text:'Gratis selamanya'},
              {icon:'ph-shield-check',text:'Data aman & terenkripsi'},
              {icon:'ph-brain',text:'AI terlatih 5000+ dataset'}
            ].map((item,i)=>(
              <div key={i} style={{display:'flex',alignItems:'center',gap:10,color:'rgba(255,255,255,.75)',fontSize:14,fontWeight:600}}>
                <i className={`ph ${item.icon}`} style={{color:'var(--green-400)',fontSize:18}}></i> {item.text}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="auth-panel">
        <div className="auth-card register-card">
          <div style={{marginBottom:24}}>
            <div style={{width:48,height:48,background:'var(--green-100)',borderRadius:'var(--radius-md)',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:16,fontSize:24}}>
              <i className="ph ph-user-plus" style={{color:'var(--green-600)'}}></i>
            </div>
            <h3>Daftar Akun</h3>
            <p className="auth-subtitle">Isi formulir di bawah untuk membuat akun baru.</p>
          </div>

          {error && (
            <div style={{display:'flex',alignItems:'center',gap:8,background:'#fef2f2',border:'1.5px solid #fca5a5',color:'#dc2626',borderRadius:'var(--radius-md)',padding:'12px 14px',fontSize:13,fontWeight:600,marginBottom:16}}>
              <i className="ph ph-warning-circle"></i> {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-field">
              <label><i className="ph ph-user" style={{marginRight:5,color:'var(--green-600)'}}></i>Nama Lengkap</label>
              <div className="input-group">
                <span className="input-group-text"><i className="ph ph-user"></i></span>
                <input className="form-control" type="text" name="name" placeholder="Nama lengkap Anda" value={form.name} onChange={handleChange} required />
              </div>
            </div>
            <div className="form-field">
              <label><i className="ph ph-envelope" style={{marginRight:5,color:'var(--green-600)'}}></i>Email</label>
              <div className="input-group">
                <span className="input-group-text"><i className="ph ph-envelope"></i></span>
                <input className="form-control" type="email" name="email" placeholder="petani@email.com" value={form.email} onChange={handleChange} required />
              </div>
            </div>
            <div className="form-field">
              <label><i className="ph ph-lock" style={{marginRight:5,color:'var(--green-600)'}}></i>Password</label>
              <div className="input-group">
                <span className="input-group-text"><i className="ph ph-lock"></i></span>
                <input className="form-control" type="password" name="password" placeholder="Min. 6 karakter" value={form.password} onChange={handleChange} required />
              </div>
            </div>
            <div className="form-field" style={{marginBottom:24}}>
              <label><i className="ph ph-lock-key" style={{marginRight:5,color:'var(--green-600)'}}></i>Konfirmasi Password</label>
              <div className="input-group">
                <span className="input-group-text"><i className="ph ph-lock-key"></i></span>
                <input className="form-control" type="password" name="confirmPassword" placeholder="Ulangi password" value={form.confirmPassword} onChange={handleChange} required />
              </div>
            </div>
            <button className="btn btn-dark w-100" type="submit" disabled={loading}>
              {loading
                ? <><span className="spinner-border spinner-border-sm me-2"></span>Mendaftar...</>
                : <><i className="ph ph-user-plus me-2"></i>Buat Akun</>
              }
            </button>
          </form>
          <p className="auth-switch">Sudah punya akun? <Link to="/login">Login sekarang</Link></p>
        </div>
      </div>
    </div>
  );
}
