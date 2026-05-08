import api, { clearAuth } from './api';

export const register = async ({ name, email, password }) => {
  const { data } = await api.post('/auth/register', { name, email, password });
  saveSession(data.data);
  return data.data;
};

export const login = async ({ email, password }) => {
  const { data } = await api.post('/auth/login', { email, password });
  saveSession(data.data);
  return data.data;
};

export const logout = async () => {
  try {
    await api.post('/auth/logout');
  } catch (_) {
    // tetap logout lokal meski request gagal
  } finally {
    clearAuth();
  }
};

export const getMe = async () => {
  const { data } = await api.get('/auth/me');
  return data.data.user;
};

const saveSession = ({ accessToken, refreshToken, user }) => {
  localStorage.setItem('access_token', accessToken);
  localStorage.setItem('refresh_token', refreshToken);
  localStorage.setItem('ricecare_user', JSON.stringify(user));
  localStorage.setItem('ricecare_auth', 'true');
};

export const getCurrentUser = () => {
  try {
    return JSON.parse(localStorage.getItem('ricecare_user'));
  } catch {
    return null;
  }
};

export const isLoggedIn = () => localStorage.getItem('ricecare_auth') === 'true';
