'use client';

import { useState } from 'react';
import { AuthForm } from '@/components/AuthForm';
import { Sparkles } from 'lucide-react';

export default function SignUpPage() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signup');

  const handleSuccess = () => {
    // Redirect to dashboard or onboarding
    window.location.href = '/dashboard';
  };

  const handleSwitchMode = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex items-center justify-center gap-2 mb-6">
          <Sparkles className="h-8 w-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">LaunchKit AI</h1>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <AuthForm
            mode={mode}
            onSuccess={handleSuccess}
            onSwitchMode={handleSwitchMode}
          />
        </div>
      </div>
    </div>
  );
}
