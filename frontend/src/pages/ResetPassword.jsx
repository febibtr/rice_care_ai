import { useState } from 'react';
import { Link } from 'react-router-dom';
import farmBg from '../assets/fram-padi.jpg';

export default function ResetPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email) { setError('Alamat email wajib diisi.'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    setSent(true);
  };

  return (
    <div className="auth-layout">
      <div
        className="auth-cover"
        style={{ backgroundImage: `linear-gradient(rgba(7,35,19,.72),rgba(7,35,19,.72)),url(${farmBg})` }}
      >
        <div style={{ marginBottom: 'auto', paddingTop: 48 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(255,255,255,.1)', border: '1px solid rgba(255,255,255,.2)',
            borderRadius: 999, padding: '6px 14px', color: 'rgba(255,255,255,.8)',
            fontSize: 13, fontWeight: 700
          }}>
            <i className="ph ph-leaf"></i> RiceCare AI
          </div>
        </div>
        <div>
          <h1>Tenang,<br/>Kami Bantu 🔑</h1>
          <h4>Reset Password Akun</h4>
          <p>Masukkan email Anda dan kami akan mengirimkan tautan untuk membuat password baru dalam hitungan menit.</p>
          <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { icon: 'ph-envelope-simple', text: 'Cek kotak masuk email Anda' },
              { icon: 'ph-shield-check', text: 'Tautan aman & terenkripsi' },
              { icon: 'ph-clock', text: 'Berlaku selama 15 menit' },
            ].map((item, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                color: 'rgba(255,255,255,.75)', fontSize: 14, fontWeight: 600
              }}>
                <i className={`ph ${item.icon}`} style={{ color: 'var(--green-400)', fontSize: 18 }}></i>
                {item.text}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="auth-panel">
        <div className="auth-card">
          <div style={{ marginBottom: 24 }}>
            <div style={{
              width: 48, height: 48, background: 'var(--green-100)',
              borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center',
              justifyContent: 'center', marginBottom: 16, fontSize: 24
            }}>
              <i className="ph ph-lock-key-open" style={{ color: 'var(--green-600)' }}></i>
            </div>
            <h3>Lupa Password?</h3>
            <p className="auth-subtitle">
              Masukkan email yang terdaftar. Kami akan mengirimkan tautan reset password.
            </p>
          </div>

          {error && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: '#fef2f2', border: '1.5px solid #fca5a5', color: '#dc2626',
              borderRadius: 'var(--radius-md)', padding: '12px 14px',
              fontSize: 13, fontWeight: 600, marginBottom: 16
            }}>
              <i className="ph ph-warning-circle"></i> {error}
            </div>
          )}

          {sent ? (
            <div style={{
              textAlign: 'center', padding: '28px 16px',
              background: 'var(--green-50)', borderRadius: 'var(--radius-lg)',
              border: '1.5px solid var(--green-200)'
            }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>📬</div>
              <h4 style={{ fontWeight: 800, color: 'var(--green-700)', marginBottom: 8 }}>
                Email Terkirim!
              </h4>
              <p style={{ color: 'var(--gray-500)', fontSize: 14, lineHeight: 1.6 }}>
                Kami telah mengirimkan tautan reset password ke{' '}
                <b style={{ color: 'var(--green-700)' }}>{email}</b>.
                Silakan cek kotak masuk Anda.
              </p>
              <p style={{ color: 'var(--gray-400)', fontSize: 12, marginTop: 12 }}>
                Tidak menerima email?{' '}
                <button
                  onClick={() => setSent(false)}
                  style={{ background: 'none', border: 'none', color: 'var(--green-600)', fontWeight: 700, cursor: 'pointer', fontSize: 12 }}
                >
                  Kirim ulang
                </button>
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-field">
                <label>
                  <i className="ph ph-envelope" style={{ marginRight: 5, color: 'var(--green-600)' }}></i>
                  Email Terdaftar
                </label>
                <div className="input-group">
                  <span className="input-group-text"><i className="ph ph-envelope"></i></span>
                  <input
                    className="form-control"
                    type="email"
                    placeholder="petani@email.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <button
                className="btn btn-dark w-100"
                type="submit"
                disabled={loading}
                style={{ marginTop: 8 }}
              >
                {loading
                  ? <><span className="spinner-border spinner-border-sm me-2"></span>Mengirim...</>
                  : <><i className="ph ph-paper-plane-right me-2"></i>Kirim Tautan Reset</>
                }
              </button>
            </form>
          )}

          <p className="auth-switch" style={{ marginTop: 20 }}>
            Ingat password? <Link to="/login">Kembali ke Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
