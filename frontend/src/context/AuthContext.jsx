import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || '');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      if (token) {
        try {
          const res = await api.get('/auth/me');
          if (res.data.success && res.data.data) {
            setUser((prev) => {
              const updatedUser = { ...prev, ...res.data.data };
              localStorage.setItem('user', JSON.stringify(updatedUser));
              return updatedUser;
            });
          }
        } catch (err) {
          console.error("Auth verification failed:", err.message);
          logout();
        }
      }
      setLoading(false);
    };
    verifyUser();
  }, [token]);

  const login = async (email, password, role) => {
    const res = await api.post('/auth/login', { email, password, role });
    if (res.data.success && res.data.data) {
      const data = res.data.data;
      setToken(data.token);
      setUser(data);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      return data;
    }
    throw new Error(res.data.message || 'Login failed');
  };

  const registerDonor = async (donorData) => {
    const res = await api.post('/auth/register/donor', donorData);
    if (res.data.success && res.data.data) {
      const data = res.data.data;
      setToken(data.token);
      setUser(data);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      return data;
    }
    throw new Error(res.data.message || 'Donor registration failed');
  };

  const registerHospital = async (hospitalData) => {
    const res = await api.post('/auth/register/hospital', hospitalData);
    if (res.data.success && res.data.data) {
      const data = res.data.data;
      setToken(data.token);
      setUser(data);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      return data;
    }
    throw new Error(res.data.message || 'Hospital registration failed');
  };

  const logout = () => {
    setToken('');
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const updateUserState = (updatedFields) => {
    setUser((prev) => {
      const next = { ...prev, ...updatedFields };
      localStorage.setItem('user', JSON.stringify(next));
      return next;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        registerDonor,
        registerHospital,
        logout,
        updateUserState,
        isAuthenticated: !!token && !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
