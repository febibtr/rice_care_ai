import { Link, NavLink, useNavigate } from 'react-router-dom';
import logo from '../assets/logo-ricecare-ai.png';
import { logout, getCurrentUser, isLoggedIn as checkLogin } from '../services/authService';

export default function Navbar() {
  const navigate = useNavigate();
  const loggedIn = checkLogin();
  const user = getCurrentUser();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const requireAuthPath = (path) => (loggedIn ? path : '/register');

  return (
    <nav className="rice-navbar">
      <Link className="brand-logo" to="/"><img src={logo} alt="RiceCare AI" /></Link>

      <div className="nav-center">
        <NavLink className="nav-link" to="/">Beranda</NavLink>
        <div className="nav-dropdown">
          <button className="nav-link nav-dropdown-button" type="button">
            Deteksi <i className="bi bi-chevron-down"></i>
          </button>
          <div className="dropdown-menu-custom">
            <Link to={requireAuthPath('/scan')}>Deteksi</Link>
            <Link to={requireAuthPath('/riwayat')}>Riwayat</Link>
          </div>
        </div>
        <NavLink className="nav-link" to={requireAuthPath('/penanganan')}>Penanganan</NavLink>
      </div>

      <div className="nav-action">
        {loggedIn ? (
          <div className="user-menu">
            <button className="user-icon-btn" type="button" aria-label="Menu user">
              <i className="bi bi-person-fill"></i>
              {user?.name && <span style={{fontSize:12,marginLeft:4,maxWidth:80,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{user.name.split(' ')[0]}</span>}
            </button>
            <div className="user-dropdown">
              {user && <span style={{padding:'8px 16px',fontSize:12,color:'#6b7c6b',display:'block',borderBottom:'1px solid #e0e8e0'}}>{user.email}</span>}
              <button type="button" onClick={handleLogout}>Logout</button>
            </div>
          </div>
        ) : (
          <Link className="login-btn" to="/login">Login</Link>
        )}
      </div>
    </nav>
  );
}
