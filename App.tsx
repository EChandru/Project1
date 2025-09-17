import React, { useState, useCallback, useEffect } from 'react';
import { FormPanel } from './components/FormPanel';
import { OutputPanel } from './components/OutputPanel';
import { generateDietPlan } from './services/geminiService';
import { PatientData } from './types';
import { IconStethoscope, IconLogout } from './components/Icons';
import { LoginPage } from './components/LoginPage';
import { SignupPage } from './components/SignupPage';
import { ForgotPasswordPage } from './components/ForgotPasswordPage';
import { UpdatePasswordPage } from './components/UpdatePasswordPage';
import { OtpVerificationPage } from './components/OtpVerificationPage';
import { supabase } from './supabaseClient';
import type { Session } from '@supabase/supabase-js';

type AuthPage = 'login' | 'signup' | 'forgot-password' | 'update-password' | 'otp-verification';

const App: React.FC = () => {
  // --- Authentication State ---
  const [session, setSession] = useState<Session | null>(null);
  const [authPage, setAuthPage] = useState<AuthPage>('login');
  const [isLoadingSession, setIsLoadingSession] = useState<boolean>(true);
  const [verificationEmail, setVerificationEmail] = useState<string>('');


  // --- Diet Planner State ---
  const [patientData, setPatientData] = useState<PatientData>({
    patientName: '',
    age: '',
    gender: 'Male',
    prakriti: 'Vata',
    vikriti: 'Balanced',
    digestion: 'Average',
    allergies: '',
    healthGoals: '',
  });
  const [dietOutput, setDietOutput] = useState<string>('<p class="text-center text-slate-400">Your personalized diet plan will appear here. Fill out the patient details and click the button to begin.</p>');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    // Check for an active session when the component mounts
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoadingSession(false);
    });

    // Listen for changes in authentication state (login, logout, password recovery)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setAuthPage('update-password');
      }
      setSession(session);
    });

    // Clean up the subscription when the component unmounts
    return () => subscription.unsubscribe();
  }, []);


  // --- Handlers ---
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setAuthPage('login'); // Reset to login page on logout
  };

  const navigateTo = (page: AuthPage, email: string = '') => {
    setVerificationEmail(email);
    setAuthPage(page);
  };

  const onGenerateClick = useCallback(async () => {
    const { patientName, age, prakriti } = patientData;
    if (!patientName || !age || !prakriti) {
      setDietOutput('<p class="text-center font-semibold text-red-500">Please fill in all required fields: Patient Name, Age, and Prakriti.</p>');
      return;
    }

    setIsLoading(true);
    setDietOutput(''); // Clear previous output

    try {
      const response = await generateDietPlan(patientData);
      setDietOutput(response);
    } catch (error) {
      console.error('Error generating diet plan:', error);
      setDietOutput('<p class="text-center font-semibold text-red-500">An error occurred while generating the diet plan. Please check the console for details and try again.</p>');
    } finally {
      setIsLoading(false);
    }
  }, [patientData]);


  // --- Render Logic ---
  if (isLoadingSession) {
    return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">Loading...</div>;
  }
  
  if (!session) {
    switch (authPage) {
      case 'signup':
        return <SignupPage onNavigateToLogin={() => navigateTo('login')} onVerificationNeeded={(email) => navigateTo('otp-verification', email)} />;
      case 'forgot-password':
        return <ForgotPasswordPage onNavigateToLogin={() => navigateTo('login')} />;
      case 'update-password':
        return <UpdatePasswordPage onPasswordUpdated={() => navigateTo('login')} />;
       case 'otp-verification':
        return <OtpVerificationPage email={verificationEmail} onNavigateToLogin={() => navigateTo('login')} />;
      case 'login':
      default:
        return <LoginPage onNavigateToSignup={() => navigateTo('signup')} onNavigateToForgotPassword={() => navigateTo('forgot-password')} onVerificationNeeded={(email) => navigateTo('otp-verification', email)} />;
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <div className="inline-block bg-slate-800 p-4 rounded-full shadow-lg border border-slate-700">
                        <IconStethoscope className="w-12 h-12 text-indigo-400" />
                    </div>
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-bold text-white">
                        Ayurvedic Diet Architect
                        </h1>
                        <p className="text-md text-slate-400">AI-Powered Personalized Nutrition Plans</p>
                    </div>
                </div>
                <button 
                    onClick={handleLogout}
                    className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-2 px-4 rounded-lg border border-slate-700 transition-colors duration-300"
                    aria-label="Logout"
                >
                    <IconLogout className="w-5 h-5" />
                    <span className="hidden sm:inline">Logout</span>
                </button>
            </div>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <FormPanel 
              patientData={patientData} 
              setPatientData={setPatientData} 
              onGenerate={onGenerateClick} 
              isLoading={isLoading} 
            />
          </div>
          <div className="lg:col-span-3">
            <OutputPanel 
              dietOutput={dietOutput} 
              isLoading={isLoading} 
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;