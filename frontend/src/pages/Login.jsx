import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import farmBg from '../assets/fram-padi.jpg';
import { login } from '../services/authService';

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.email || !form.password) { setError('Email dan password wajib diisi.'); return; }
    setLoading(true);
    try {
      await login({ email: form.email, password: form.password });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login gagal, coba lagi.');
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
          <h1>Selamat Datang<br/>Kembali</h1>
          <h4>Login ke akunmu</h4>
          <p>Lindungi tanaman padi Anda dengan teknologi deteksi penyakit berbasis AI.</p>
          <div style={{display:'flex',gap:16,marginTop:32}}>
            {['<i class="ph ph-scan"></i> Deteksi AI','<i class="ph ph-shield"></i> 95% Akurasi','<i class="ph ph-clock"></i> Realtime'].map((t,i)=>(
              <div key={i} style={{background:'rgba(255,255,255,.08)',border:'1px solid rgba(255,255,255,.14)',borderRadius:12,padding:'10px 14px',color:'rgba(255,255,255,.7)',fontSize:12,fontWeight:700}} dangerouslySetInnerHTML={{__html:t}}/>
            ))}
          </div>
        </div>
      </div>

      <div className="auth-panel">
        <div className="auth-card">
          <div style={{marginBottom:24}}>
            <div style={{width:48,height:48,background:'var(--green-100)',borderRadius:'var(--radius-md)',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:16,fontSize:24}}>
              <i className="ph ph-sign-in" style={{color:'var(--green-600)'}}></i>
            </div>
            <h3>Login</h3>
            <p className="auth-subtitle">Masukkan kredensial akun Anda untuk melanjutkan.</p>
          </div>

          {error && (
            <div style={{display:'flex',alignItems:'center',gap:8,background:'#fef2f2',border:'1.5px solid #fca5a5',color:'#dc2626',borderRadius:'var(--radius-md)',padding:'12px 14px',fontSize:13,fontWeight:600,marginBottom:16}}>
              <i className="ph ph-warning-circle"></i> {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
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
                <input className="form-control" type={showPass ? 'text' : 'password'} name="password" placeholder="••••••••" value={form.password} onChange={handleChange} required />
                <button className="input-group-text" type="button" onClick={() => setShowPass(!showPass)}>
                  <i className={`ph ${showPass ? 'ph-eye-slash' : 'ph-eye'}`}></i>
                </button>
              </div>
            </div>
            <div style={{textAlign:'right',marginBottom:20,marginTop:-8}}>
              <Link to="/reset-password" className="small-link">Lupa password?</Link>
            </div>
            <button className="btn btn-dark w-100" type="submit" disabled={loading}>
              {loading
                ? <><span className="spinner-border spinner-border-sm me-2"></span>Masuk...</>
                : <><i className="ph ph-sign-in me-2"></i>Masuk</>
              }
            </button>
          </form>

          <p className="auth-switch">Belum punya akun? <Link to="/register">Daftar Akun</Link></p>
        </div>
      </div>
    </div>
  );
}
