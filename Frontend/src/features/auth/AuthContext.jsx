import React, { createContext, useContext, useState, useEffect } from 'react';
import * as authService from '../services/auth.api';

// Create the authentication context
const AuthContext = createContext(null);

/**
 * AuthProvider component that wraps the application (or parts of it) 
 * to provide global authentication state and methods.
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if the user is already authenticated on mount
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setUser(null);
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        const data = await authService.getme();
        setUser(data.user || data); 
      } catch (err) {
        console.error("Failed to fetch user:", err);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUser();
  }, []);

  /**
   * Register a new user
   * @param {Object} credentials - { username, email, password }
   */
  const register = async (credentials) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await authService.register(credentials);
      return data;
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Log in an existing user
   * @param {Object} credentials - { email, password }
   */
  const login = async (credentials) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await authService.login(credentials);
      if (data.token) {
        localStorage.setItem('authToken', data.token);
      }
      setUser(data.user || data);
      return data;
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      localStorage.removeItem('authToken');
      setUser(null);
    }
  };

  const value = {
    user,
    isLoading,
    error,
    register,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Custom hook for components to access the authentication state and methods.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
