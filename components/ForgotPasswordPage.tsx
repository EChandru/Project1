import React, { useState } from 'react';
import { AuthLayout } from './AuthLayout';
import { IconUser, IconKey } from './Icons';
import { supabase } from '../supabaseClient';
import { AuthApiError } from '@supabase/supabase-js';

interface ForgotPasswordPageProps {
  onNavigateToLogin: () => void;
}

export const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ onNavigateToLogin }) => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [stage, setStage] = useState<'email' | 'otp'>('email');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePasswordResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email);

    if (error) {
       if (error instanceof AuthApiError && error.status === 429) {
        setError('You are trying too frequently. Please wait a moment before trying again.');
      } else {
        setError('Could not send reset code due to a server issue. Please try again later.');
      }
    } else {
      setMessage('A 6-digit code has been sent to your email.');
      setStage('otp');
    }
    
    setLoading(false);
  };

  const handleOtpVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error: verifyError } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'recovery',
    });

    if (verifyError) {
        setError(verifyError.message);
    }
    // On success, the onAuthStateChange listener in App.tsx will navigate to the update password page.

    setLoading(false);
  };

  return (
    <AuthLayout title="Reset Your Password">
      <form onSubmit={stage === 'email' ? handlePasswordResetRequest : handleOtpVerification} className="space-y-6">
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        {message && <p className="text-green-400 text-sm text-center">{message}</p>}
        
        {stage === 'email' && (
            <p className="text-center text-sm text-slate-400">
                Enter your email address and we will send you a 6-digit code to reset your password.
            </p>
        )}

        {stage === 'email' ? (
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
        ) : (
          <div>
            <label htmlFor="otp" className="block text-sm font-medium text-slate-400 mb-1.5">Verification Code</label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <IconKey className="h-5 w-5 text-slate-500" />
              </div>
              <input
                type="text"
                id="otp"
                name="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="6-digit code"
                required
                disabled={loading}
                className="w-full pl-10 pr-3 py-2 bg-slate-700 border border-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-slate-200 placeholder-slate-500"
              />
            </div>
          </div>
        )}
        
        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 disabled:bg-indigo-500 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            {loading ? 'Sending...' : (stage === 'email' ? 'Send Code' : 'Verify Code')}
          </button>
        </div>

        <p className="text-center text-sm text-slate-400">
          Remember your password?{' '}
          <button type="button" onClick={onNavigateToLogin} className="font-semibold text-indigo-400 hover:text-indigo-300">
            Log in
          </button>
        </p>
      </form>
    </AuthLayout>
  );
};