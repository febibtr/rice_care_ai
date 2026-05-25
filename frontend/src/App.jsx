import { Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import ResetPassword from './pages/ResetPassword.jsx';
import ResetPasswordConfirm from './pages/ResetPasswordConfirm.jsx';
import Scan from './pages/Scan.jsx';
import Riwayat from './pages/Riwayat.jsx';
import Penanganan from './pages/Penanganan.jsx';
import DetailPenanganan from './pages/DetailPenanganan.jsx';
import Profil from './pages/Profil.jsx';

function ProtectedPage({ children }) {
  const isLoggedIn = localStorage.getItem('ricecare_auth') === 'true';
  return isLoggedIn ? children : <Navigate to="/register" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/reset-password/confirm" element={<ResetPasswordConfirm />} />
      <Route path="/scan" element={<ProtectedPage><Scan /></ProtectedPage>} />
      <Route path="/riwayat" element={<ProtectedPage><Riwayat /></ProtectedPage>} />
      <Route path="/penanganan" element={<ProtectedPage><Penanganan /></ProtectedPage>} />
      <Route path="/penanganan/detail" element={<ProtectedPage><DetailPenanganan /></ProtectedPage>} />
      <Route path="/profil" element={<ProtectedPage><Profil /></ProtectedPage>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
