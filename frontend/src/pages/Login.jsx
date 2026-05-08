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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-layout">
      <div className="auth-cover" style={{ backgroundImage: `linear-gradient(rgba(7,35,19,.68),rgba(7,35,19,.68)),url(${farmBg})` }}>
        <h1>RiceCare AI</h1>
        <h4>Selamat Datang Kembali</h4>
        <p>Lindungi tanaman padi Anda dengan teknologi AI</p>
      </div>
      <div className="auth-panel">
        <div className="auth-card">
          <h3>Login</h3>
          <p className="auth-subtitle">Silakan masukkan kredensial Anda.</p>
          {error && <div className="alert alert-danger py-2 small">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="input-group mb-3">
              <span className="input-group-text"><i className="bi bi-envelope"></i></span>
              <input className="form-control" type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
            </div>
            <div className="input-group mb-2">
              <span className="input-group-text"><i className="bi bi-lock"></i></span>
              <input className="form-control" type={showPass ? 'text' : 'password'} name="password" placeholder="Password" value={form.password} onChange={handleChange} required />
              <button className="input-group-text" type="button" onClick={() => setShowPass(!showPass)}>
                <i className={`bi ${showPass ? 'bi-eye-slash' : 'bi-eye'}`}></i>
              </button>
            </div>
            <div className="text-end mb-3">
              <Link to="/reset-password" className="small-link">Lupa password?</Link>
            </div>
            <button className="btn btn-dark w-100" type="submit" disabled={loading}>
              {loading ? <><span className="spinner-border spinner-border-sm me-2"></span>Masuk...</> : 'Login'}
            </button>
          </form>
          <p className="auth-switch">Belum punya akun? <Link to="/register">Daftar</Link></p>
        </div>
      </div>
    </div>
  );
}
