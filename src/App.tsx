import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from './firebase';

export interface UserPreferences {
  role: string | null;
  useCase: string | null;
  name: string;
}

function generateSyncCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

function App() {
  const [syncCode, setSyncCode] = useState(() => {
    let code = localStorage.getItem('notepad_sync_code');
    if (!code) {
      code = generateSyncCode();
      localStorage.setItem('notepad_sync_code', code);
    }
    return code;
  });

  const [onboardingComplete, setOnboardingComplete] = useState(() => {
    return localStorage.getItem('onboardingComplete') === 'true';
  });
  const [preferences, setPreferences] = useState<UserPreferences>({
    role: null,
    useCase: null,
    name: ''
  });

  // Listen to Firestore for preferences sync
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "workspaces", syncCode), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.preferences) {
          setPreferences(data.preferences);
          // If we receive valid preferences from cloud, we've onboarded
          if (data.preferences.role && !localStorage.getItem('onboardingComplete')) {
            setOnboardingComplete(true);
            localStorage.setItem('onboardingComplete', 'true');
          }
        }
      }
    });
    return () => unsub();
  }, [syncCode]);

  const handleComplete = async (prefs: UserPreferences) => {
    setPreferences(prefs);
    setOnboardingComplete(true);
    localStorage.setItem('onboardingComplete', 'true');
    // Save to Firestore
    await setDoc(doc(db, "workspaces", syncCode), { preferences: prefs }, { merge: true });
  };

  const handleSkip = () => {
    setOnboardingComplete(true);
    localStorage.setItem('onboardingComplete', 'true');
  };

  const handleBackToSetup = () => {
    setOnboardingComplete(false);
    localStorage.setItem('onboardingComplete', 'false');
  };

  return (
    <div className="dashboard-layout">
      <AnimatePresence mode="wait">
        {!onboardingComplete ? (
          <Onboarding 
            key="onboarding" 
            onComplete={handleComplete} 
            onSkip={handleSkip} 
            onSync={(code) => { 
              setSyncCode(code); 
              localStorage.setItem('notepad_sync_code', code);
              setOnboardingComplete(true);
              localStorage.setItem('onboardingComplete', 'true');
            }}
          />
        ) : (
          <Dashboard 
            key="dashboard" 
            preferences={preferences} 
            onBack={handleBackToSetup}
            syncCode={syncCode}
          />
        )}
      </AnimatePresence>
      <div style={{ 
        position: 'fixed', 
        bottom: '16px', 
        right: '24px', 
        fontSize: '12px', 
        color: 'var(--text-secondary)', 
        zIndex: 100, 
        pointerEvents: 'none',
        opacity: 0.6
      }}>
        Designed by rahul chintapalli
      </div>
    </div>
  );
}

export default App;
