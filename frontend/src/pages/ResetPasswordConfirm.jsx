import { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { resetPassword } from '../services/authService';
import farmBg from '../assets/fram-padi.jpg';

export default function ResetPasswordConfirm() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const email = searchParams.get('email') || '';
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token || !email) {
      setError('Tautan reset tidak lengkap atau salah.');
    }
  }, [token, email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (newPassword.length < 6) return setError('Password minimal 6 karakter');
    if (newPassword !== confirm) return setError('Konfirmasi password tidak cocok');
    setLoading(true);
    try {
      await resetPassword({ token, email, newPassword });
      setSuccess(true);
      setLoading(false);
      setTimeout(() => navigate('/login'), 2500);
    } catch (err) {
      setLoading(false);
      const msg = err?.response?.data?.message || 'Gagal mereset password';
      setError(msg);
    }
  };

  if (error) {
    return (
      <div className="auth-layout">
        <div className="auth-cover" style={{ backgroundImage: `linear-gradient(rgba(7,35,19,.72),rgba(7,35,19,.72)),url(${farmBg})` }}>
          <div style={{ marginBottom: 'auto', paddingTop: 48 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,.1)', border: '1px solid rgba(255,255,255,.2)', borderRadius: 999, padding: '6px 14px', color: 'rgba(255,255,255,.8)', fontSize: 13, fontWeight: 700 }}>
              RiceCare AI
            </div>
          </div>
          <div>
            <h1>Lupa Password?<br/>Tidak Masalah.</h1>
            <h4>Kami siapkan tautan reset untuk Anda.</h4>
            <p>Pastikan menggunakan email yang sama dengan yang terdaftar di akun Anda.</p>
          </div>
        </div>

        <div className="auth-panel">
          <div className="auth-card">
            <h3>Error</h3>
            <p style={{ color: 'var(--danger)' }}>{error}</p>
            <p>
              <Link to="/reset-password">Kembali ke halaman reset password</Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-layout">
      <div className="auth-cover" style={{ backgroundImage: `linear-gradient(rgba(7,35,19,.72),rgba(7,35,19,.72)),url(${farmBg})` }}>
        <div style={{ marginBottom: 'auto', paddingTop: 48 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,.1)', border: '1px solid rgba(255,255,255,.2)', borderRadius: 999, padding: '6px 14px', color: 'rgba(255,255,255,.8)', fontSize: 13, fontWeight: 700 }}>
            RiceCare AI
          </div>
        </div>
        <div>
          <h1>Buat Password Baru</h1>
          <h4>Lengkapi data di samping untuk mengamankan akun Anda kembali.</h4>
          <p>Gunakan kata sandi yang kuat dan mudah diingat, minimal 6 karakter.</p>
          <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 10, color: 'rgba(255,255,255,.75)', fontSize: 14, fontWeight: 600 }}>
            <div>• Pastikan password baru tidak sama dengan yang lama</div>
            <div>• Hindari menggunakan kata mudah ditebak</div>
          </div>
        </div>
      </div>

      <div className="auth-panel">
        <div className="auth-card">
          {success ? (
            <div style={{ textAlign: 'center' }}>
              <h3>Password berhasil diubah</h3>
              <p>Anda akan diarahkan ke halaman login dalam beberapa detik.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <h3>Buat Password Baru</h3>
              <div className="form-field">
                <label>Password Baru</label>
                <input
                  type="password"
                  className="form-control"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <div className="form-field">
                <label>Konfirmasi Password</label>
                <input
                  type="password"
                  className="form-control"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                />
              </div>
              {error && <div style={{ color: 'var(--danger)', marginBottom: 12 }}>{error}</div>}
              <button className="btn btn-dark w-100" type="submit" disabled={loading}>
                {loading ? 'Memproses...' : 'Reset Password'}
              </button>
              <p className="auth-switch" style={{ marginTop: 16, textAlign: 'center' }}>
                Sudah ingat password? <Link to="/login">Login sekarang</Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
