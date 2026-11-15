import { useState } from 'react';
import { LoginForm } from '@/components/auth/login-form';
import { SignupForm } from '@/components/auth/signup-form';
import { CreateHouseholdForm } from '@/components/household/create-household-form';
import { JoinHouseholdForm } from '@/components/household/join-household-form';

type AuthView = 'login' | 'signup' | 'create-household' | 'join-household';

export default function AuthPage() {
  const [currentView, setCurrentView] = useState<AuthView>('login');

  const renderAuthForm = () => {
    switch (currentView) {
      case 'signup':
        return <SignupForm 
          onSwitchToLogin={() => setCurrentView('login')} 
          onSignupSuccess={() => setCurrentView('create-household')}
        />;
      case 'create-household':
        return <CreateHouseholdForm onSwitchToJoin={() => setCurrentView('join-household')} />;
      case 'join-household':
        return <JoinHouseholdForm onSwitchToCreate={() => setCurrentView('create-household')} />;
      default:
        return <LoginForm onSwitchToSignup={() => setCurrentView('signup')} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {renderAuthForm()}
        
        {(currentView === 'login' || currentView === 'signup') && (
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Need to set up your household?
            </p>
            <div className="space-x-4">
              <button
                onClick={() => setCurrentView('create-household')}
                className="text-sm text-primary hover:underline font-medium"
              >
                Create household
              </button>
              <span className="text-slate-300">•</span>
              <button
                onClick={() => setCurrentView('join-household')}
                className="text-sm text-primary hover:underline font-medium"
              >
                Join household
              </button>
            </div>
          </div>
        )}
        
        {(currentView === 'create-household' || currentView === 'join-household') && (
          <div className="mt-6 text-center">
            <button
              onClick={() => setCurrentView('login')}
              className="text-sm text-primary hover:underline font-medium"
            >
              ← Back to login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
