import React, { useState } from 'react';
import { AuthLayout } from './AuthLayout';
import { IconKey } from './Icons';
import { supabase } from '../supabaseClient';
import { AuthApiError } from '@supabase/supabase-js';

interface OtpVerificationPageProps {
  email: string;
  onNavigateToLogin: () => void;
}

export const OtpVerificationPage: React.FC<OtpVerificationPageProps> = ({ email, onNavigateToLogin }) => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState('');


  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResendMessage('');
    setLoading(true);

    const { error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: 'signup',
    });

    if (error) {
        setError(error.message);
    }
    // On success, the onAuthStateChange listener in App.tsx will create a session and log the user in.
    
    setLoading(false);
  };

  const handleResendCode = async () => {
    setIsResending(true);
    setResendMessage('');
    setError('');

    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
    });

    if (error) {
      if (error instanceof AuthApiError && error.status === 429) {
        setResendMessage('Error: You are trying too frequently. Please wait a moment before resending.');
      } else {
        setResendMessage('Error: Could not send verification code. Please try again later.');
      }
    } else {
      setResendMessage('A new verification code has been sent to your email.');
    }
    
    setIsResending(false);
  };

  return (
    <AuthLayout title="Verify Your Email">
      <form onSubmit={handleVerifyOtp} className="space-y-6">
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        {resendMessage && <p className="text-sm text-center text-yellow-300">{resendMessage}</p>}

        <p className="text-center text-sm text-slate-400">
            A 6-digit verification code has been sent to <strong className="text-slate-300">{email}</strong>. Please enter it below.
        </p>
        
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
              disabled={loading || isResending}
              className="w-full pl-10 pr-3 py-2 bg-slate-700 border border-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-slate-200 placeholder-slate-500"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={loading || isResending}
            className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 disabled:bg-indigo-500 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            {loading ? 'Verifying...' : 'Verify Email'}
          </button>
        </div>

        <div className="text-center text-sm text-slate-400 flex items-center justify-center gap-2">
            <span>Didn't receive a code?</span>
            <button
              type="button"
              onClick={handleResendCode}
              disabled={isResending}
              className="font-semibold text-indigo-400 hover:text-indigo-300 disabled:opacity-50"
            >
              {isResending ? 'Sending...' : 'Resend Code'}
            </button>
        </div>

        <p className="text-center text-sm text-slate-400 border-t border-slate-700 pt-4">
            <button type="button" onClick={onNavigateToLogin} className="font-semibold text-indigo-400 hover:text-indigo-300">
                &larr; Back to Login
            </button>
        </p>
      </form>
    </AuthLayout>
  );
};
