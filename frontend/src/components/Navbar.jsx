import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import logo from '../assets/logo-ricecare-ai.png';
import { logout, getCurrentUser, isLoggedIn as checkLogin } from '../services/authService';

export default function Navbar() {
  const navigate = useNavigate();
  const loggedIn = checkLogin();
  const user = getCurrentUser();
  const [menuOpen, setMenuOpen]     = useState(false);
  const [deteksiOpen, setDeteksiOpen] = useState(false);
  const [userOpen, setUserOpen]     = useState(false);
  const deteksiRef = useRef(null);
  const userRef    = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (deteksiRef.current && !deteksiRef.current.contains(e.target)) setDeteksiOpen(false);
      if (userRef.current    && !userRef.current.contains(e.target))    setUserOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    const handler = () => { if (window.innerWidth > 768) setMenuOpen(false); };
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  const handleLogout = async () => {
    await logout();
    setMenuOpen(false); setUserOpen(false);
    navigate('/');
  };

  const requireAuthPath = (path) => (loggedIn ? path : '/register');
  const firstLetter = user?.name?.[0]?.toUpperCase() || '?';
  const closeMenu = () => { setMenuOpen(false); setDeteksiOpen(false); setUserOpen(false); };

  return (
    <>
      <nav className="rice-navbar">
        {/* Brand */}
        <Link className="brand-logo" to="/" onClick={closeMenu}>
          <img src={logo} alt="RiceCare AI" />
          <span className="brand-name">RiceCare AI</span>
        </Link>

        {/* Desktop nav-center */}
        <div className="nav-center">
          <NavLink className="nav-link" to="/">
            <i className="ph ph-house"></i> Beranda
          </NavLink>

          {/* Deteksi dropdown — click-based */}
          <div className="nav-dropdown" ref={deteksiRef}>
            <button
              className={`nav-link nav-dropdown-button ${deteksiOpen ? 'active' : ''}`}
              type="button"
              onClick={() => setDeteksiOpen(o => !o)}
            >
              <i className="ph ph-scan"></i> Deteksi
              <i className={`ph ph-caret-down nav-caret ${deteksiOpen ? 'rotated' : ''}`}></i>
            </button>
            {deteksiOpen && (
              <div className="dropdown-menu-custom show">
                <Link to={requireAuthPath('/scan')} onClick={() => setDeteksiOpen(false)}>
                  <i className="ph ph-camera"></i> Deteksi Daun
                </Link>
                <Link to={requireAuthPath('/riwayat')} onClick={() => setDeteksiOpen(false)}>
                  <i className="ph ph-clock-counter-clockwise"></i> Riwayat
                </Link>
              </div>
            )}
          </div>

          <NavLink className="nav-link" to={requireAuthPath('/penanganan')}>
            <i className="ph ph-shield-check"></i> Penanganan
          </NavLink>

          <a className="nav-link" href="/#info-ai">
            <i className="ph ph-info"></i> Info
          </a>
        </div>

        {/* Desktop actions */}
        <div className="nav-action">
          {loggedIn ? (
            <div className="user-menu" ref={userRef}>
              <button
                className={`user-icon-btn ${userOpen ? 'active' : ''}`}
                type="button"
                onClick={() => setUserOpen(o => !o)}
              >
                <div className="user-avatar-circle">{firstLetter}</div>
                {user?.name && (
                  <span style={{fontSize:13,maxWidth:80,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
                    {user.name.split(' ')[0]}
                  </span>
                )}
                <i className={`ph ph-caret-down nav-caret ${userOpen ? 'rotated' : ''}`} style={{fontSize:12}}></i>
              </button>
              {userOpen && (
                <div className="user-dropdown show">
                  <div className="user-email-badge">
                    <i className="ph ph-envelope" style={{marginRight:5}}></i>
                    {user?.email}
                  </div>
                  <Link to="/profil" onClick={() => setUserOpen(false)}>
                    <i className="ph ph-user-circle"></i> Profil Saya
                  </Link>
                  <Link to={requireAuthPath('/riwayat')} onClick={() => setUserOpen(false)}>
                    <i className="ph ph-clock-counter-clockwise"></i> Riwayat Scan
                  </Link>
                  <button type="button" onClick={handleLogout} className="logout-item">
                    <i className="ph ph-sign-out"></i> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link className="login-btn" to="/login">
              <i className="ph ph-sign-in"></i> Masuk
            </Link>
          )}
        </div>

        {/* Burger (mobile) */}
        <button
          className="burger-btn"
          type="button"
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Toggle menu"
        >
          <i className={`ph ${menuOpen ? 'ph-x' : 'ph-list'}`}></i>
        </button>
      </nav>

      {/* Mobile nav overlay */}
      <div className={`mobile-nav ${menuOpen ? 'open' : ''}`}>
        <Link to="/" onClick={closeMenu} className="mobile-nav-item">
          <i className="ph ph-house"></i> Beranda
        </Link>

        <button
          className="mobile-nav-item mobile-nav-toggle"
          type="button"
          onClick={() => setDeteksiOpen(o => !o)}
        >
          <i className="ph ph-scan"></i> Deteksi
          <i className={`ph ph-caret-${deteksiOpen ? 'up' : 'down'} mobile-nav-caret`}></i>
        </button>
        {deteksiOpen && (
          <div className="mobile-submenu">
            <Link to={requireAuthPath('/scan')} onClick={closeMenu}>
              <i className="ph ph-camera"></i> Deteksi Daun
            </Link>
            <Link to={requireAuthPath('/riwayat')} onClick={closeMenu}>
              <i className="ph ph-clock-counter-clockwise"></i> Riwayat
            </Link>
          </div>
        )}

        <Link to={requireAuthPath('/penanganan')} onClick={closeMenu} className="mobile-nav-item">
          <i className="ph ph-shield-check"></i> Penanganan
        </Link>

        <a href="/#info-ai" onClick={closeMenu} className="mobile-nav-item">
          <i className="ph ph-info"></i> Info AI
        </a>

        <div className="mobile-nav-divider"></div>

        {loggedIn ? (
          <>
            <Link to="/profil" onClick={closeMenu} className="mobile-nav-item">
              <i className="ph ph-user-circle"></i> Profil Saya
            </Link>
            <button type="button" onClick={handleLogout} className="mobile-nav-item mobile-nav-danger">
              <i className="ph ph-sign-out"></i> Logout
            </button>
          </>
        ) : (
          <Link className="login-btn" to="/login" onClick={closeMenu}>
            <i className="ph ph-sign-in"></i> Masuk
          </Link>
        )}
      </div>
    </>
  );
}
