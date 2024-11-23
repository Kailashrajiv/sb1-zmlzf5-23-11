import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, AuthState } from '../types/auth';

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (data: { 
    fullName: string;
    email: string;
    phoneNumber: string;
    countryCode: string;
    password: string;
  }) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null
  });

  useEffect(() => {
    // Check for existing session
    const user = localStorage.getItem('user');
    if (user) {
      setState(prev => ({
        ...prev,
        user: JSON.parse(user),
        isAuthenticated: true,
        isLoading: false
      }));
    } else {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      // Mock authentication
      const mockUser: User = {
        id: '1',
        fullName: 'John Doe',
        email,
        phoneNumber: '9876543210',
        countryCode: '+91',
        createdAt: new Date().toISOString()
      };

      localStorage.setItem('user', JSON.stringify(mockUser));
      setState(prev => ({
        ...prev,
        user: mockUser,
        isAuthenticated: true,
        error: null
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Failed to sign in'
      }));
    }
  };

  const signUp = async (data: {
    fullName: string;
    email: string;
    phoneNumber: string;
    countryCode: string;
    password: string;
  }) => {
    try {
      // Mock registration
      const mockUser: User = {
        id: '1',
        fullName: data.fullName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        countryCode: data.countryCode,
        createdAt: new Date().toISOString()
      };

      localStorage.setItem('user', JSON.stringify(mockUser));
      setState(prev => ({
        ...prev,
        user: mockUser,
        isAuthenticated: true,
        error: null
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Failed to sign up'
      }));
    }
  };

  const signOut = () => {
    localStorage.removeItem('user');
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null
    });
  };

  return (
    <AuthContext.Provider value={{ ...state, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}