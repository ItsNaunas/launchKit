'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Mail, Lock } from 'lucide-react';

interface AuthFormProps {
  mode: 'signin' | 'signup';
  onSuccess: () => void;
  onSwitchMode: () => void;
}

export function AuthForm({ mode, onSuccess, onSwitchMode }: AuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (mode === 'signup') {
        if (password !== confirmPassword) {
          setError('Passwords do not match');
          return;
        }
        if (password.length < 6) {
          setError('Password must be at least 6 characters');
          return;
        }
      }

      const response = await fetch(`/api/auth/${mode}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      // Store user in localStorage
      localStorage.setItem('launchkit-user', JSON.stringify(data.user));
      
      onSuccess();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-semibold text-white mb-3 tracking-tight">
          {mode === 'signin' ? 'Welcome Back' : 'Create Account'}
        </h1>
        <p className="text-silver-400 font-light">
          {mode === 'signin' 
            ? 'Sign in to access your launch kits' 
            : 'Get started with your first launch kit'
          }
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-950/30 border border-red-500/20 rounded-xl p-4">
            <p className="text-red-300 text-sm font-light">{error}</p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-silver-300 mb-3">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-silver-500" />
            <Input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 bg-charcoal-800/40 border-white/10 text-white placeholder-silver-500 focus:border-mint-500/40 focus:bg-charcoal-800/60"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-silver-300 mb-3">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-silver-500" />
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 bg-charcoal-800/40 border-white/10 text-white placeholder-silver-500 focus:border-mint-500/40 focus:bg-charcoal-800/60"
              required
            />
          </div>
        </div>

        {mode === 'signup' && (
          <div>
            <label className="block text-sm font-medium text-silver-300 mb-3">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-silver-500" />
              <Input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pl-10 bg-charcoal-800/40 border-white/10 text-white placeholder-silver-500 focus:border-mint-500/40 focus:bg-charcoal-800/60"
                required
              />
            </div>
          </div>
        )}

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-white hover:bg-silver-100 text-black transition-all duration-300 font-medium"
          size="lg"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2"></div>
              {mode === 'signin' ? 'Signing In...' : 'Creating Account...'}
            </>
          ) : (
            mode === 'signin' ? 'Sign In' : 'Create Account'
          )}
        </Button>

        <div className="text-center">
          <button
            type="button"
            onClick={onSwitchMode}
            className="text-silver-400 hover:text-white text-sm font-light transition-colors duration-300"
          >
            {mode === 'signin' 
              ? "Don&apos;t have an account? Sign up" 
              : 'Already have an account? Sign in'
            }
          </button>
        </div>
      </form>
    </div>
  );
}
