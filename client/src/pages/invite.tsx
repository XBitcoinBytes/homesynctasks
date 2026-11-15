import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { AcceptInvite } from '@/components/accept-invite';
import { useAuth } from '@/hooks/use-auth';

export default function InvitePage() {
  const [location, setLocation] = useLocation();
  const { user, login } = useAuth();
  const [inviteCode, setInviteCode] = useState<string | null>(null);

  useEffect(() => {
    // Get invite code from URL params
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('invite');
    if (code) {
      setInviteCode(code);
    } else {
      setLocation('/auth');
    }
  }, [setLocation]);

  const handleSuccess = () => {
    // After successful join, redirect to dashboard
    setLocation('/dashboard');
  };

  if (!inviteCode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p>Loading invitation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
            HomeSync
          </h1>
          <p className="text-gray-600">Collaborative household task management</p>
        </div>
        
        <AcceptInvite 
          inviteCode={inviteCode} 
          onSuccess={handleSuccess}
        />
      </div>
    </div>
  );
}