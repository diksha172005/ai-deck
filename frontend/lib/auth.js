import { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { login as apiLogin, signup as apiSignup } from './api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = Cookies.get('user');
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch {}
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const data = await apiLogin({ email, password });
    Cookies.set('token', data.token, { expires: 7 });
    Cookies.set('user', JSON.stringify({ id: data.userId, email: data.email, name: data.name }), { expires: 7 });
    setUser({ id: data.userId, email: data.email, name: data.name });
    return data;
  };

  const signup = async (name, email, password) => {
    const data = await apiSignup({ name, email, password });
    Cookies.set('token', data.token, { expires: 7 });
    Cookies.set('user', JSON.stringify({ id: data.userId, email: data.email, name: data.name }), { expires: 7 });
    setUser({ id: data.userId, email: data.email, name: data.name });
    return data;
  };

  const logout = () => {
    Cookies.remove('token');
    Cookies.remove('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
