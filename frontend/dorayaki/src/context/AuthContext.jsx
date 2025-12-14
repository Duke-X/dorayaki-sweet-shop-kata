import { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restore session
    const token = localStorage.getItem('token');
    const storedRole = localStorage.getItem('role');
    const storedEmail = localStorage.getItem('email');

    if (token) {
      setUser({ 
          token, 
          email: storedEmail, 
          isAdmin: storedRole === 'admin' 
      });
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      
      const { token, user: userData } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('role', userData.role);
      localStorage.setItem('email', userData.email);

      setUser({ 
          token, 
          email: userData.email, 
          isAdmin: userData.role === 'admin' 
      });
      return true;
    } catch (error) {
      console.error("Login failed", error);
      throw error;
    }
  };

  const register = async (name, email, password, adminKey) => {
    try {
      const response = await api.post('/auth/register', { name, email, password, adminKey });
      
      const { token, user: userData } = response.data;
      
      if (token && token !== "fake-jwt-token") {
         localStorage.setItem('token', token);
         // Guard against backend not returning user object (if user didn't restart backend yet)
         const role = userData?.role || 'user'; 
         localStorage.setItem('role', role);
         localStorage.setItem('email', email); // userData might be undefined if old backend

         setUser({ 
             token, 
             email: email, 
             isAdmin: role === 'admin'
         });
      }
      return true;
    } catch (error) {
       console.error("Register failed", error);
       throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('email');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
