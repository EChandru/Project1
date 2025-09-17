import React from 'react';
import { IconStethoscope } from './Icons';

interface AuthLayoutProps {
  title: string;
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ title, children }) => {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full">
        <header className="text-center mb-8">
            <div className="inline-block bg-slate-800 p-4 rounded-full shadow-lg border border-slate-700">
                <IconStethoscope className="w-12 h-12 text-indigo-400" />
            </div>
            <h1 className="text-4xl font-bold text-white mt-4">
                Ayurvedic Diet Architect
            </h1>
            <p className="text-lg text-slate-400 mt-2">{title}</p>
        </header>
        <main className="bg-slate-800 p-8 rounded-2xl shadow-xl border border-slate-700">
            {children}
        </main>
      </div>
    </div>
  );
};
