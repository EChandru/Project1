import React, { useState } from 'react';
import { AuthLayout } from './AuthLayout';
import { IconUser, IconLock } from './Icons';
import { supabase } from '../supabaseClient';

interface LoginPageProps {
  onNavigateToSignup: () => void;
  onNavigateToForgotPassword: () => void;
  onVerificationNeeded: (email: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigateToSignup, onNavigateToForgotPassword, onVerificationNeeded }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      // Specifically check for the email not confirmed error
      if (error.message.toLowerCase().includes('email not confirmed')) {
        onVerificationNeeded(email);
      } else {
        setError(error.message);
      }
    } 
    // On success, the onAuthStateChange listener in App.tsx will handle the redirect.
    
    setLoading(false);
  };

  return (
    <AuthLayout title="Welcome Back">
      <form onSubmit={handleLogin} className="space-y-6">
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-400 mb-1.5">Email Address</label>
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
            <div className="flex items-center justify-between">
                <label htmlFor="password"  className="block text-sm font-medium text-slate-400 mb-1.5">Password</label>
                <button type="button" onClick={onNavigateToForgotPassword} className="text-sm font-medium text-indigo-400 hover:text-indigo-300 disabled:opacity-50" disabled={loading}>
                    Forgot Password?
                </button>
            </div>
           <div className="relative mt-1">
             <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
               <IconLock className="h-5 w-5 text-slate-500" />
             </div>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </div>
        <p className="text-center text-sm text-slate-400">
          Don't have an account?{' '}
          <button type="button" onClick={onNavigateToSignup} className="font-semibold text-indigo-400 hover:text-indigo-300 disabled:opacity-50" disabled={loading}>
            Sign up
          </button>
        </p>
      </form>
    </AuthLayout>
  );
};