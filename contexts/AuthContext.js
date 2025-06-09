import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext({});

// Mock users database
const MOCK_USERS = [
  {
    id: 1,
    email: 'demo@bookeasy.com',
    password: 'password123',
    firstName: 'Demo',
    lastName: 'User',
    phone: '+1 (555) 123-4567',
  },
  {
    id: 2,
    email: 'test@example.com',
    password: 'test123',
    firstName: 'Test',
    lastName: 'Account',
    phone: '+1 (555) 987-6543',
  },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  // Simulate checking for existing session on app start
  useEffect(() => {
    const checkAuthStatus = async () => {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, you could auto-login here
      // setUser(MOCK_USERS[0]);
      
      setIsInitializing(false);
    };

    checkAuthStatus();
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Find user in mock database
      const foundUser = MOCK_USERS.find(
        u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );

      if (!foundUser) {
        throw new Error('Invalid email or password');
      }

      // Remove password from user object before storing
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);

      return {
        success: true,
        user: userWithoutPassword,
        message: 'Login successful!'
      };
    } catch (error) {
      throw new Error(error.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData) => {
    setIsLoading(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      const { firstName, lastName, email, password, phone } = userData;

      // Check if user already exists
      const existingUser = MOCK_USERS.find(
        u => u.email.toLowerCase() === email.toLowerCase()
      );

      if (existingUser) {
        throw new Error('An account with this email already exists');
      }

      // Create new user
      const newUser = {
        id: MOCK_USERS.length + 1,
        firstName,
        lastName,
        email: email.toLowerCase(),
        phone: phone || '',
        createdAt: new Date().toISOString(),
      };

      // Add to mock database (in real app, this would be an API call)
      MOCK_USERS.push({ ...newUser, password });

      // Auto-login after registration
      setUser(newUser);

      return {
        success: true,
        user: newUser,
        message: 'Account created successfully!'
      };
    } catch (error) {
      throw new Error(error.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setUser(null);
      
      return {
        success: true,
        message: 'Logged out successfully'
      };
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updates) => {
    setIsLoading(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);

      return {
        success: true,
        user: updatedUser,
        message: 'Profile updated successfully!'
      };
    } catch (error) {
      throw new Error(error.message || 'Profile update failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Demo login function for quick testing
  const demoLogin = async () => {
    return await login('demo@bookeasy.com', 'password123');
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
    demoLogin,

    // Mock data for development
    MOCK_USERS: MOCK_USERS.map(({ password, ...user }) => user), // Remove passwords
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