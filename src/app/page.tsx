'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';
import { Sparkles, Target, Zap, Download, LogOut, ChevronDown, Globe, FileText, TrendingUp, ArrowRight } from 'lucide-react';
import Pricing from '@/components/Pricing';
import { VercelV0Chat } from '@/components/VercelV0Chat';
import { WavyBackground } from '@/components/ui/wavy-background';

export default function HomePage() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [businessIdea, setBusinessIdea] = useState('');

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">

      {/* Interactive Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-dark"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-mint-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-mint-600/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Header */}
      <header className="relative z-50 border-b border-white/5 bg-black/70 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Sparkles className="h-6 w-6 text-mint-500" />
              <h1 className="text-xl font-semibold text-white tracking-tight">LaunchKit AI</h1>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-sm text-gray-400 hover:text-mint-500 transition-colors duration-300">Features</Link>
              <Link href="#pricing" className="text-sm text-gray-400 hover:text-mint-500 transition-colors duration-300">Pricing</Link>
              {user ? (
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-400">{user.email}</span>
                  <Button variant="outline" size="sm" onClick={signOut} className="border-mint-600/30 text-gray-300 hover:text-mint-500 hover:bg-mint-600/10 transition-all duration-300">
                    <LogOut className="h-4 w-4 mr-1.5" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Button variant="outline" size="sm" onClick={() => window.location.href = '/auth/signin'} className="border-mint-600/30 text-gray-300 hover:text-mint-500 hover:bg-mint-600/10 transition-all duration-300">
                    Sign In
                  </Button>
                  <Button size="sm" onClick={() => window.location.href = '/auth/signup'} className="bg-gradient-to-r from-mint-500 to-mint-600 text-white hover:from-mint-600 hover:to-mint-700 transition-all duration-300 shadow-lg shadow-mint-500/25">
                    Sign Up
                  </Button>
                </div>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section - Dark & Cinematic */}
      <section className="relative min-h-screen overflow-hidden bg-black">
        {/* Content */}
        <div className="relative z-10 min-h-screen flex items-center justify-center pt-32 pb-64">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
            {/* Main Headline */}
            <div className="relative mb-8 overflow-hidden">
              {/* Wavy background behind the entire headline */}
              <div className="absolute inset-0 z-0">
                <WavyBackground
                  colors={["#1DCD9F", "#2dd4bf", "#5eead4", "#99f6e4", "#ccfbf1"]}
                  waveOpacity={0.6}
                  blur={30}
                  speed="slow"
                  backgroundFill="transparent"
                  className="w-full h-full"
                  containerClassName="w-full h-full"
                />
              </div>
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-clash font-semibold text-white leading-[1.1] tracking-tight relative z-10">
                Everything you need to go from{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-mint-300 to-mint-500">
                  0 → 6/7 figures
                </span>
              </h1>
            </div>
            
            {/* Subtext */}
            <p className="text-lg md:text-xl text-gray-400 mb-16 max-w-4xl mx-auto font-light leading-relaxed">
              Get a complete business case, 30-day content strategy, and professional landing page in minutes. 
              Built with insights from successful founders who&apos;ve scaled to millions. Skip the months of planning 
              and start executing with AI-powered strategies tailored specifically to your idea.
            </p>

            {/* Chat Interface */}
            <div className="mb-24">
              <VercelV0Chat />
            </div>

            {/* Three Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto pb-32">
              {/* Card 1: Business Case */}
              <div className="relative bg-gradient-to-br from-dark/40 to-black/20 border border-mint-600/20 rounded-3xl p-10 backdrop-blur-sm hover:border-mint-500/40 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-mint-500/10 group cursor-pointer">
                <div className="relative">
                  <div className="w-14 h-14 bg-mint-500/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-mint-500/20 transition-colors duration-300">
                    <TrendingUp className="h-7 w-7 text-mint-400 group-hover:text-mint-300 transition-colors duration-300" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-4 tracking-tight">Business Case</h3>
                  <p className="text-silver-500 leading-relaxed text-sm font-light">
                    Market positioning, pricing strategy, and competitive analysis tailored to your idea.
                  </p>
                </div>
              </div>

              {/* Card 2: Content Strategy */}
              <div className="relative bg-gradient-to-br from-charcoal-800/40 to-charcoal-900/20 border border-white/5 rounded-3xl p-10 backdrop-blur-sm md:mt-8">
                <div className="relative">
                  <div className="w-14 h-14 bg-silver-400/10 rounded-2xl flex items-center justify-center mb-8">
                    <FileText className="h-7 w-7 text-silver-300" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-4 tracking-tight">Content Strategy</h3>
                  <p className="text-silver-500 leading-relaxed text-sm font-light">
                    30-day content calendar with viral hooks and channel-specific optimization.
                  </p>
                </div>
              </div>

              {/* Card 3: Website */}
              <div className="relative bg-gradient-to-br from-charcoal-800/40 to-charcoal-900/20 border border-white/5 rounded-3xl p-10 backdrop-blur-sm">
                <div className="relative">
                  <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-8">
                    <Globe className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-4 tracking-tight">Website</h3>
                  <p className="text-silver-500 leading-relaxed text-sm font-light">
                    Professional landing pages designed to convert visitors into customers.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Scroll Indicator */}
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2">
            <ChevronDown className="h-6 w-6 text-silver-700" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-40 bg-gradient-to-b from-black via-charcoal-950 to-black">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-semibold text-white mb-6 tracking-tight">
              Everything You Need to Launch
            </h2>
            <p className="text-xl text-silver-400 max-w-2xl mx-auto font-light">
              Skip months of planning. Get your complete launch strategy in minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-10 rounded-3xl bg-charcoal-900/30 border border-white/5">
              <div className="w-14 h-14 bg-mint-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Target className="h-7 w-7 text-mint-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-3 tracking-tight">Business Case</h3>
              <p className="text-silver-500 text-sm leading-relaxed font-light">
                Market positioning, pricing strategy, and competitive analysis tailored to your idea.
              </p>
            </div>

            <div className="text-center p-10 rounded-3xl bg-charcoal-900/30 border border-white/5">
              <div className="w-14 h-14 bg-silver-400/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Zap className="h-7 w-7 text-silver-300" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-3 tracking-tight">Content Strategy</h3>
              <p className="text-silver-500 text-sm leading-relaxed font-light">
                30-day content calendar with viral hooks and channel-specific optimization.
              </p>
            </div>

            <div className="text-center p-10 rounded-3xl bg-charcoal-900/30 border border-white/5">
              <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Download className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-3 tracking-tight">Ready-to-Use Assets</h3>
              <p className="text-silver-500 text-sm leading-relaxed font-light">
                Download PDFs, templates, and resources you can use immediately.
              </p>
            </div>

            <div className="text-center p-10 rounded-3xl bg-charcoal-900/30 border border-white/5">
              <div className="w-14 h-14 bg-mint-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Sparkles className="h-7 w-7 text-mint-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-3 tracking-tight">AI Refinement</h3>
              <p className="text-silver-500 text-sm leading-relaxed font-light">
                Regenerate any section up to 3 times to get exactly what you need.
              </p>
            </div>
          </div>
        </div>

        {/* Background accent - very subtle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl opacity-[0.02] pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 bg-mint-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-silver-400 rounded-full blur-3xl"></div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative bg-gradient-to-b from-black via-charcoal-950 to-black">
        <Pricing />
        
        {/* Background gradient - very subtle */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-3xl opacity-[0.03] pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-mint-500 rounded-full blur-3xl"></div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-40 bg-gradient-to-b from-black via-charcoal-950 to-black">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-white mb-8 tracking-tight leading-tight">
            Ready to Launch Your Idea?
          </h2>
          <p className="text-xl text-silver-400 mb-14 max-w-2xl mx-auto font-light leading-relaxed">
            Join hundreds of entrepreneurs who&apos;ve turned their ideas into reality with AI-powered launch strategies.
          </p>
          <Link href="/start">
            <Button 
              size="lg" 
              className="px-10 py-7 text-lg bg-white hover:bg-silver-100 text-black shadow-2xl shadow-white/10 font-medium tracking-tight"
            >
              Create My Launch Kit Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>

        {/* Spotlight effect - very subtle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-mint-500/[0.02] rounded-full blur-3xl pointer-events-none"></div>
      </section>

      {/* Footer */}
      <footer className="relative bg-black border-t border-white/5 py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-16">
            <div className="flex items-center gap-2.5 mb-8 md:mb-0">
              <Sparkles className="h-6 w-6 text-mint-500" />
              <span className="text-xl font-semibold text-white tracking-tight">LaunchKit AI</span>
            </div>
            <div className="flex gap-10 text-sm">
              <a href="#" className="text-silver-500 hover:text-white transition-colors duration-300 font-light">Privacy Policy</a>
              <a href="#" className="text-silver-500 hover:text-white transition-colors duration-300 font-light">Terms of Service</a>
              <a href="#" className="text-silver-500 hover:text-white transition-colors duration-300 font-light">Contact</a>
            </div>
          </div>
          <div className="border-t border-white/5 pt-10 text-center text-sm text-silver-600 font-light">
            © 2025 LaunchKit AI. Built with the knowledge of founders who dominate.
          </div>
        </div>
      </footer>
    </div>
  );
}
