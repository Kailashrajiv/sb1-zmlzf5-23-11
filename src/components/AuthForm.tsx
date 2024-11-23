import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff, X } from 'lucide-react';

const COUNTRY_CODES = [
  { code: '+91', country: 'India' },
  { code: '+1', country: 'USA' },
  { code: '+44', country: 'UK' },
  { code: '+81', country: 'Japan' },
];

interface AuthFormProps {
  onClose: () => void;
}

export default function AuthForm({ onClose }: AuthFormProps) {
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();
  const [isSignIn, setIsSignIn] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: 'John Doe',
    email: 'john@example.com',
    phoneNumber: '9876543210',
    countryCode: '+91',
    password: 'password123'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!isSignIn && !formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = 'Invalid email address';
    }

    if (!formData.phoneNumber.match(/^\d{10}$/)) {
      newErrors.phoneNumber = 'Phone number must be 10 digits';
    }

    if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      if (isSignIn) {
        await signIn(formData.email, formData.password);
      } else {
        await signUp(formData);
      }
      navigate('/dashboard');
    } catch (error) {
      console.error('Authentication error:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-to-br from-white via-blue-50/50 to-purple-50/50 rounded-xl shadow-xl max-w-md w-full p-8 relative border border-white/20">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        <div className="mb-8">
          <h2 className="text-center text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {isSignIn ? 'Welcome back!' : 'Create your account'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {isSignIn
              ? 'Sign in to access your dashboard'
              : 'Get started with your free account'}
          </p>
        </div>

        <div className="flex justify-center space-x-4 mb-8">
          <button className="flex-1 flex items-center justify-center px-4 py-2.5 border border-gray-200 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            <img className="h-5 w-5 mr-2" src="https://www.google.com/favicon.ico" alt="Google" />
            Continue with Google
          </button>
          <button className="flex-1 flex items-center justify-center px-4 py-2.5 border border-gray-200 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            <img className="h-5 w-5 mr-2" src="https://www.apple.com/favicon.ico" alt="Apple" />
            Continue with Apple
          </button>
        </div>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200/80"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 text-gray-500 bg-gradient-to-br from-white via-blue-50/50 to-purple-50/50">
              <span className="relative bg-gradient-to-r from-gray-500 to-gray-600 bg-clip-text text-transparent">
                or continue with email
              </span>
            </span>
          </div>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {!isSignIn && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className={`mt-1 block w-full px-3 py-2.5 border ${
                  errors.fullName ? 'border-red-500' : 'border-gray-200'
                } rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white`}
              />
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={`mt-1 block w-full px-3 py-2.5 border ${
                errors.email ? 'border-red-500' : 'border-gray-200'
              } rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white`}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <div className="mt-1 flex">
              <select
                value={formData.countryCode}
                onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                className="w-24 border-r-0 rounded-r-none border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                {COUNTRY_CODES.map(({ code, country }) => (
                  <option key={code} value={code}>
                    {code} {country}
                  </option>
                ))}
              </select>
              <input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                className={`flex-1 border-l-0 rounded-l-none ${
                  errors.phoneNumber ? 'border-red-500' : 'border-gray-200'
                } rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white`}
              />
            </div>
            {errors.phoneNumber && (
              <p className="mt-1 text-sm text-red-500">{errors.phoneNumber}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="mt-1 relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className={`block w-full px-3 py-2.5 border ${
                  errors.password ? 'border-red-500' : 'border-gray-200'
                } rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password}</p>
            )}
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              {isSignIn ? 'Sign in' : 'Create account'}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsSignIn(!isSignIn)}
            className="text-sm text-blue-600 hover:text-blue-500"
          >
            {isSignIn
              ? "Don't have an account? Sign up"
              : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
}