import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('carcare_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('carcare_token') || null);
  const [loading, setLoading] = useState(true);

  // Synchronize authentication state on mount
  useEffect(() => {
    const fetchMe = async () => {
      const storedToken = localStorage.getItem('carcare_token');
      if (storedToken) {
        try {
          const res = await api.get('/auth/me');
          if (res.data.success) {
            setUser(res.data.data);
            localStorage.setItem('carcare_user', JSON.stringify(res.data.data));
          }
        } catch (err) {
          console.warn('Session expired or invalid token');
          logout();
        }
      }
      setLoading(false);
    };

    fetchMe();

    const handleExternalLogout = () => {
      setUser(null);
      setToken(null);
    };

    window.addEventListener('auth-logout', handleExternalLogout);
    return () => window.removeEventListener('auth-logout', handleExternalLogout);
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data.success) {
      const { token: receivedToken, user: receivedUser } = res.data;
      setToken(receivedToken);
      setUser(receivedUser);
      localStorage.setItem('carcare_token', receivedToken);
      localStorage.setItem('carcare_user', JSON.stringify(receivedUser));
      return receivedUser;
    }
  };

  const register = async (userData) => {
    const res = await api.post('/auth/register', userData);
    if (res.data.success) {
      const { token: receivedToken, user: receivedUser } = res.data;
      setToken(receivedToken);
      setUser(receivedUser);
      localStorage.setItem('carcare_token', receivedToken);
      localStorage.setItem('carcare_user', JSON.stringify(receivedUser));
      return receivedUser;
    }
  };

  const logout = () => {
    localStorage.removeItem('carcare_token');
    localStorage.removeItem('carcare_user');
    setToken(null);
    setUser(null);
  };

  const updateCurrentUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('carcare_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!token && !!user,
        role: user ? user.role : null,
        login,
        register,
        logout,
        updateCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
