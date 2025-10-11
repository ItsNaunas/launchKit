'use client';

import { useState } from 'react';
import { AuthForm } from '@/components/AuthForm';
import { Sparkles } from 'lucide-react';

export default function SignUpPage() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signup');

  const handleSuccess = () => {
    // Redirect to homepage after successful signup
    window.location.href = '/';
  };

  const handleSwitchMode = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin');
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Cinematic Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Subtle gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal-900/30 via-black to-black"></div>
        
        {/* Soft animated orbs - subtle and elegant */}
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-mint-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-silver-400/3 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        {/* Noise texture overlay - very subtle */}
        <div className="absolute inset-0 opacity-[0.02] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')]"></div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex items-center justify-center gap-2.5 mb-8">
            <Sparkles className="h-7 w-7 text-mint-500" />
            <h1 className="text-2xl font-semibold text-white tracking-tight">LaunchKit AI</h1>
          </div>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-gradient-to-br from-charcoal-800/40 to-charcoal-900/20 border border-white/10 py-10 px-6 rounded-3xl backdrop-blur-sm shadow-2xl">
            <AuthForm
              mode={mode}
              onSuccess={handleSuccess}
              onSwitchMode={handleSwitchMode}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
