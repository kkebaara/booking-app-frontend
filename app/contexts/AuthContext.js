// app/contexts/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import AuthService from '../../services/authService';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  // Listen to authentication state changes
  useEffect(() => {
    const unsubscribe = AuthService.onAuthStateChange((user) => {
      setUser(user);
      setIsInitializing(false);
    });

    // Cleanup subscription on unmount
    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const result = await AuthService.login(email, password);
      return result;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData) => {
    setIsLoading(true);
    try {
      const result = await AuthService.register(userData);
      return result;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      const result = await AuthService.logout();
      return result;
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updates) => {
    setIsLoading(true);
    try {
      const result = await AuthService.updateProfile(updates);
      
      // Update local user state
      setUser(prevUser => ({
        ...prevUser,
        ...updates
      }));
      
      return result;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const sendPasswordReset = async (email) => {
    setIsLoading(true);
    try {
      const result = await AuthService.sendPasswordReset(email);
      return result;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    setIsLoading(true);
    try {
      const result = await AuthService.changePassword(currentPassword, newPassword);
      return result;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Demo login for testing (creates a real demo account)
  const demoLogin = async () => {
    return await login('demo@bookeasy.com', 'demo123456');
  };

  const value = {
    // State
    user,
    isLoading,
    isInitializing,
    isAuthenticated: !!user,

    // Actions
    login,
    register,
    logout,
    updateProfile,
    sendPasswordReset,
    changePassword,
    demoLogin,

    // Utilities
    getCurrentUser: AuthService.getCurrentUser,
    isLoggedIn: AuthService.isLoggedIn,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;