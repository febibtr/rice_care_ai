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
    e.preventDefault();
    setError('');
    if (!form.name || !form.email || !form.password) { setError('Semua field wajib diisi.'); return; }
    if (form.password.length < 6) { setError('Password minimal 6 karakter.'); return; }
    if (form.password !== form.confirmPassword) { setError('Konfirmasi password tidak cocok.'); return; }
    setLoading(true);
    try {
      await register({ name: form.name, email: form.email, password: form.password });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registrasi gagal, coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-layout">
      <div className="auth-cover" style={{ backgroundImage: `linear-gradient(rgba(7,35,19,.68),rgba(7,35,19,.68)),url(${farmBg})` }}>
        <h1>RiceCare AI</h1>
        <h4>Buat Akun Baru</h4>
        <p>Mulai gunakan RiceCare AI untuk membantu pemeriksaan tanaman padi.</p>
      </div>
      <div className="auth-panel">
        <div className="auth-card register-card">
          <h3>Daftar akun</h3>
          {error && <div className="alert alert-danger py-2 small">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="input-group mb-3">
              <span className="input-group-text"><i className="bi bi-person"></i></span>
              <input className="form-control" type="text" name="name" placeholder="Nama lengkap" value={form.name} onChange={handleChange} required />
            </div>
            <div className="input-group mb-3">
              <span className="input-group-text"><i className="bi bi-envelope"></i></span>
              <input className="form-control" type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
            </div>
            <div className="input-group mb-3">
              <span className="input-group-text"><i className="bi bi-lock"></i></span>
              <input className="form-control" type="password" name="password" placeholder="Password (min. 6 karakter)" value={form.password} onChange={handleChange} required />
            </div>
            <div className="input-group mb-4">
              <span className="input-group-text"><i className="bi bi-lock-fill"></i></span>
              <input className="form-control" type="password" name="confirmPassword" placeholder="Konfirmasi Password" value={form.confirmPassword} onChange={handleChange} required />
            </div>
            <button className="btn btn-dark w-100" type="submit" disabled={loading}>
              {loading ? <><span className="spinner-border spinner-border-sm me-2"></span>Mendaftar...</> : 'Daftar'}
            </button>
          </form>
          <p className="auth-switch">Sudah punya akun? <Link to="/login">Langsung login saja</Link></p>
        </div>
      </div>
    </div>
  );
}
