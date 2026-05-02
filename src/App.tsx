import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import CVBuilder from './components/CVBuilder';
import Dashboard from './components/Dashboard';
import { UserProfile } from './lib/types';
import { Sun, Moon } from 'lucide-react';

type AppState = 'landing' | 'builder' | 'dashboard';

export default function App() {
  const [state, setState] = useState<AppState>('landing');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const handleStart = () => setState('builder');
  
  const handleBuilderComplete = (profile: UserProfile) => {
    setUserProfile(profile);
    setState('dashboard');
  };

  const handleEditProfile = () => setState('builder');

  return (
    <div className="font-sans antialiased min-h-screen">
      {/* Theme Toggle Floating Button */}
      <button 
        onClick={toggleTheme}
        className="fixed top-6 right-6 z-[100] w-12 h-12 glass shadow-lg rounded-2xl flex items-center justify-center text-editorial-ink hover:scale-110 active:scale-95 transition-all"
      >
        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      {state === 'landing' && <LandingPage onStart={handleStart} />}
      
      {state === 'builder' && (
        <CVBuilder onComplete={handleBuilderComplete} />
      )}
      
      {state === 'dashboard' && userProfile && (
        <Dashboard user={userProfile} onEdit={handleEditProfile} />
      )}
    </div>
  );
}
