
import React, { useState } from 'react';
import { AuthLayout } from './AuthLayout';
import { IconLock } from './Icons';
import { supabase } from '../supabaseClient';

interface UpdatePasswordPageProps {
    onPasswordUpdated: () => void;
}

export const UpdatePasswordPage: React.FC<UpdatePasswordPageProps> = ({ onPasswordUpdated }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    
    if (password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
        setError(error.message);
    } else {
        setMessage('Your password has been updated successfully! Redirecting to login...');
        setTimeout(() => {
            onPasswordUpdated();
        }, 2500); // Wait 2.5 seconds before redirecting
    }

    setLoading(false);
  };

  return (
    <AuthLayout title="Set a New Password">
      <form onSubmit={handleUpdatePassword} className="space-y-6">
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        {message && <p className="text-green-400 text-sm text-center">{message}</p>}
        
        {!message && (
            <>
                <div>
                  <label htmlFor="password"  className="block text-sm font-medium text-slate-400 mb-1.5">New Password</label>
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
                  <label htmlFor="confirmPassword"  className="block text-sm font-medium text-slate-400 mb-1.5">Confirm New Password</label>
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
                    {loading ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
            </>
        )}
      </form>
    </AuthLayout>
  );
};
