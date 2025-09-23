'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { MiniIntakeForm } from '@/components/MiniIntakeForm';
import { useAuth } from '@/contexts/AuthContext';
import { Sparkles, Target, Zap, Download, User, LogOut } from 'lucide-react';

interface MiniIntakeData {
  business_idea: string;
  budget: 'shoestring' | 'moderate' | 'premium';
  challenges: string[];
}

export default function HomePage() {
  const [showMiniIntake, setShowMiniIntake] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user, signOut } = useAuth();

  const handleMiniIntakeSubmit = async (data: MiniIntakeData) => {
    setIsLoading(true);
    try {
      // Create a kit with mini-intake data
      const response = await fetch('/api/kits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idea_title: data.business_idea,
          one_liner: data.business_idea,
          category: 'service', // Default, will be refined in teaser flow
          target_audience: 'General audience', // Will be refined
          primary_goal: 'launch',
          budget_band: data.budget === 'shoestring' ? 'none' : data.budget === 'moderate' ? '100-500' : '500-2000',
          time_horizon: '30d',
          challenges: JSON.stringify(data.challenges),
          geography: 'UK',
          brand_vibe: 'accessible',
          sales_channel_focus: 'Mixed'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create kit');
      }

      const { kitId } = await response.json();
      
      // Redirect to teaser flow
      window.location.href = `/kit/${kitId}/teaser`;
    } catch (error) {
      console.error('Error creating kit:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">LaunchKit AI</h1>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="#features" className="text-gray-600 hover:text-gray-900">Features</Link>
              <Link href="#pricing" className="text-gray-600 hover:text-gray-900">Pricing</Link>
              {user ? (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600">{user.email}</span>
                  <Button variant="outline" size="sm" onClick={signOut}>
                    <LogOut className="h-4 w-4 mr-1" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => window.location.href = '/auth/signin'}>
                    Sign In
                  </Button>
                  <Button size="sm" onClick={() => window.location.href = '/auth/signup'}>
                    Sign Up
                  </Button>
                </div>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {!showMiniIntake ? (
            <>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                Launch Your Business Idea
                <span className="block text-blue-600">in 30 Days with AI</span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Get a complete launch strategy, content plan, and business roadmap 
                tailored specifically for your idea. No generic templates—just AI-powered 
                insights that actually work.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Button 
                  size="lg" 
                  className="px-8 py-4 text-lg"
                  onClick={() => setShowMiniIntake(true)}
                >
                  What's your dream business?
                </Button>
                <Button variant="outline" size="lg" className="px-8 py-4 text-lg">
                  See Example Kit
                </Button>
              </div>

              <p className="text-sm text-gray-500">
                ✨ £37 one-time or £1/day for 37 days • No subscriptions • Instant access
              </p>
            </>
          ) : (
            <div className="max-w-4xl mx-auto">
              <MiniIntakeForm 
                onSubmit={handleMiniIntakeSubmit}
                isLoading={isLoading}
              />
            </div>
          )}
        </div>

        {/* Background decoration */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-6xl opacity-10 pointer-events-none">
          <div className="absolute top-20 left-10 w-20 h-20 bg-blue-500 rounded-full blur-xl"></div>
          <div className="absolute top-40 right-10 w-32 h-32 bg-indigo-500 rounded-full blur-xl"></div>
          <div className="absolute bottom-20 left-1/3 w-24 h-24 bg-purple-500 rounded-full blur-xl"></div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Launch
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Skip months of planning. Get your complete launch strategy in minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50">
              <Target className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Business Case</h3>
              <p className="text-gray-600 text-sm">
                Market positioning, pricing strategy, and competitive analysis tailored to your idea.
              </p>
            </div>

            <div className="text-center p-6 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50">
              <Zap className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Content Strategy</h3>
              <p className="text-gray-600 text-sm">
                30-day content calendar with viral hooks and channel-specific optimization.
              </p>
            </div>

            <div className="text-center p-6 rounded-lg bg-gradient-to-br from-purple-50 to-pink-50">
              <Download className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready-to-Use Assets</h3>
              <p className="text-gray-600 text-sm">
                Download PDFs, templates, and resources you can use immediately.
              </p>
            </div>

            <div className="text-center p-6 rounded-lg bg-gradient-to-br from-orange-50 to-red-50">
              <Sparkles className="h-12 w-12 text-orange-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Refinement</h3>
              <p className="text-gray-600 text-sm">
                Regenerate any section up to 3 times to get exactly what you need.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Simple, Fair Pricing
            </h2>
            <p className="text-xl text-gray-600">
              Choose the payment option that works for you
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm border-2 border-gray-200 p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Pay Once</h3>
              <div className="text-4xl font-bold text-gray-900 mb-4">
                £37
                <span className="text-lg font-normal text-gray-600">/one-time</span>
              </div>
              <p className="text-gray-600 mb-6">Perfect for immediate access to your complete launch kit</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  </div>
                  <span className="text-gray-700">Complete business case & strategy</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  </div>
                  <span className="text-gray-700">30-day content strategy</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  </div>
                  <span className="text-gray-700">Downloadable PDFs</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  </div>
                  <span className="text-gray-700">3 regenerations per section</span>
                </li>
              </ul>
              <Button 
                className="w-full" 
                size="lg"
                onClick={() => window.location.href = '/start'}
              >
                Get Started
              </Button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border-2 border-blue-200 p-8 relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Flexible
                </span>
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Daily Plan</h3>
              <div className="text-4xl font-bold text-gray-900 mb-4">
                £1
                <span className="text-lg font-normal text-gray-600">/day × 37</span>
              </div>
              <p className="text-gray-600 mb-6">Spread the cost over time, same great value</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  </div>
                  <span className="text-gray-700">Everything in Pay Once</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  </div>
                  <span className="text-gray-700">Cancel anytime</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  </div>
                  <span className="text-gray-700">Auto-ends after 37 days</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  </div>
                  <span className="text-gray-700">Same £37 total</span>
                </li>
              </ul>
              <Button 
                variant="outline" 
                className="w-full" 
                size="lg"
                onClick={() => window.location.href = '/start'}
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Launch Your Idea?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join hundreds of entrepreneurs who&apos;ve turned their ideas into reality with AI-powered launch strategies.
          </p>
          <Button 
            variant="secondary" 
            size="lg" 
            className="px-8 py-4 text-lg"
            onClick={() => window.location.href = '/start'}
          >
            Create My Launch Kit Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Sparkles className="h-6 w-6 text-blue-400" />
              <span className="text-xl font-bold">LaunchKit AI</span>
            </div>
            <div className="flex gap-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white">Privacy Policy</a>
              <a href="#" className="hover:text-white">Terms of Service</a>
              <a href="#" className="hover:text-white">Contact</a>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            © 2024 LaunchKit AI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
