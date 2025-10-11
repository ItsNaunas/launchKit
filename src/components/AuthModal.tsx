'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { X, Sparkles, AlertCircle } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  mode?: 'signup' | 'signin';
}

export function AuthModal({ isOpen, onClose, onSuccess, mode: initialMode = 'signup' }: AuthModalProps) {
  const [mode, setMode] = useState<'signup' | 'signin'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const endpoint = mode === 'signup' ? '/api/auth/signup' : '/api/auth/signin';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      // Success - call onSuccess callback
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-charcoal-900 border border-white/10 rounded-2xl shadow-2xl max-w-md w-full p-8">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-silver-500 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-mint-500/10 rounded-lg flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-mint-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">
                {mode === 'signup' ? 'Create Your Account' : 'Welcome Back'}
              </h2>
            </div>
          </div>
          <p className="text-silver-400 text-sm">
            {mode === 'signup' 
              ? 'Sign up to start generating your launch kit with AI-powered insights.'
              : 'Sign in to access your launch kit and continue where you left off.'
            }
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-silver-300 mb-2">
              Email Address
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="bg-charcoal-800 border-white/10 text-white placeholder-silver-600"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-silver-300 mb-2">
              Password
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
              className="bg-charcoal-800 border-white/10 text-white placeholder-silver-600"
            />
            {mode === 'signup' && (
              <p className="text-xs text-silver-500 mt-1">At least 6 characters</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-white hover:bg-silver-100 text-black"
            size="lg"
          >
            {isLoading ? 'Processing...' : (mode === 'signup' ? 'Create Account' : 'Sign In')}
          </Button>
        </form>

        {/* Switch mode */}
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => {
              setMode(mode === 'signup' ? 'signin' : 'signup');
              setError('');
            }}
            className="text-sm text-silver-400 hover:text-white transition-colors"
          >
            {mode === 'signup' ? (
              <>Already have an account? <span className="font-semibold">Sign in</span></>
            ) : (
              <>Don&apos;t have an account? <span className="font-semibold">Sign up</span></>
            )}
          </button>
        </div>

        {/* Trust messaging */}
        <div className="mt-6 pt-6 border-t border-white/10">
          <p className="text-xs text-silver-500 text-center">
            By continuing, you agree to our Terms of Service and Privacy Policy.
            <br />
            <span className="text-mint-400">No credit card required.</span>
          </p>
        </div>
      </div>
    </div>
  );
}

