import React, { useState } from 'react';
import { AuthLayout } from './AuthLayout';
import { IconUser, IconLock } from './Icons';
import { supabase } from '../supabaseClient';
import { AuthApiError } from '@supabase/supabase-js';


interface SignupPageProps {
  onNavigateToLogin: () => void;
  onVerificationNeeded: (email: string) => void;
}

export const SignupPage: React.FC<SignupPageProps> = ({ onNavigateToLogin, onVerificationNeeded }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }
    
    const { error } = await supabase.auth.signUp({
        email: email,
        password: password,
    });

    if (error) {
      if (error instanceof AuthApiError && error.status === 429) {
          setError('Too many requests. Please wait a moment before trying to sign up again.');
      } else {
          setError(error.message);
      }
    } else {
      onVerificationNeeded(email);
    }
    
    setLoading(false);
  };

  return (
    <AuthLayout title="Create Your Account">
      <form onSubmit={handleSignup} className="space-y-6">
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        
        <div>
            <label htmlFor="email"  className="block text-sm font-medium text-slate-400 mb-1.5">Email Address</label>
            <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <IconUser className="h-5 w-5 text-slate-500" />
                </div>
            <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                disabled={loading}
                className="w-full pl-10 pr-3 py-2 bg-slate-700 border border-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-slate-200 placeholder-slate-500"
            />
            </div>
        </div>
        <div>
            <label htmlFor="password"  className="block text-sm font-medium text-slate-400 mb-1.5">Password</label>
            <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <IconLock className="h-5 w-5 text-slate-500" />
                </div>
            <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                required
                disabled={loading}
                className="w-full pl-10 pr-3 py-2 bg-slate-700 border border-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-slate-200 placeholder-slate-500"
            />
            </div>
        </div>
        <div>
            <label htmlFor="confirmPassword"  className="block text-sm font-medium text-slate-400 mb-1.5">Confirm Password</label>
            <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <IconLock className="h-5 w-5 text-slate-500" />
                </div>
            <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={loading}
                className="w-full pl-10 pr-3 py-2 bg-slate-700 border border-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-slate-200 placeholder-slate-500"
            />
            </div>
        </div>
        <div>
            <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 disabled:bg-indigo-500 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
            {loading ? 'Creating Account...' : 'Create Account'}
            </button>
        </div>
        
        <p className="text-center text-sm text-slate-400">
            Already have an account?
            {' '}
            <button type="button" onClick={onNavigateToLogin} className="font-semibold text-indigo-400 hover:text-indigo-300">
                Log in
            </button>
        </p>
      </form>
    </AuthLayout>
  );
};