'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';
import { Sparkles, Target, Zap, Download, LogOut, ChevronDown, Globe, FileText, TrendingUp, ArrowRight } from 'lucide-react';

export default function HomePage() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [businessIdea, setBusinessIdea] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);

  // Parallax effect
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Mouse tracking for magnetic effect
  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">

      {/* Cinematic Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Subtle gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal-900/30 via-black to-black"></div>
        
        {/* Soft animated orbs - subtle and elegant */}
        <div 
          className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-gold-500/5 rounded-full blur-3xl transition-transform duration-[2000ms] ease-out"
          style={{ transform: `translate(${scrollY * 0.1}px, ${scrollY * 0.05}px)` }}
        ></div>
        <div 
          className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-silver-400/3 rounded-full blur-3xl transition-transform duration-[2000ms] ease-out"
          style={{ transform: `translate(-${scrollY * 0.08}px, -${scrollY * 0.04}px)` }}
        ></div>
        
        {/* Noise texture overlay - very subtle */}
        <div className="absolute inset-0 opacity-[0.02] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')]"></div>
      </div>

      {/* Header */}
      <header className="relative z-50 border-b border-white/5 bg-black/70 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Sparkles className="h-6 w-6 text-gold-500" />
              <h1 className="text-xl font-semibold text-white tracking-tight">LaunchKit AI</h1>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-sm text-silver-400 hover:text-white transition-colors duration-300">Features</Link>
              <Link href="#pricing" className="text-sm text-silver-400 hover:text-white transition-colors duration-300">Pricing</Link>
              {user ? (
                <div className="flex items-center gap-4">
                  <span className="text-sm text-silver-400">{user.email}</span>
                  <Button variant="outline" size="sm" onClick={signOut} className="border-white/10 text-silver-300 hover:text-white hover:bg-white/5 transition-all duration-300">
                    <LogOut className="h-4 w-4 mr-1.5" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Button variant="outline" size="sm" onClick={() => window.location.href = '/auth/signin'} className="border-white/10 text-silver-300 hover:text-white hover:bg-white/5 transition-all duration-300">
                    Sign In
                  </Button>
                  <Button size="sm" onClick={() => window.location.href = '/auth/signup'} className="bg-white text-black hover:bg-silver-100 transition-all duration-300">
                    Sign Up
                  </Button>
                </div>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section - Dark & Cinematic */}
      <section className="relative min-h-screen flex items-center justify-center py-32 overflow-hidden">
        <div 
          className="max-w-7xl mx-auto px-6 lg:px-8 text-center relative z-10 parallax-container"
          style={{ transform: `translateY(${scrollY * 0.3}px)` }}
        >
          {/* Main Headline */}
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-8 leading-[1.1] tracking-tight text-fade text-fade-1">
            Everything you need to go from{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-silver-100 to-gold-400">
              0 → 6/7 figures
            </span>
          </h1>
          
          {/* Subtext */}
          <p className="text-xl md:text-2xl text-silver-400 mb-20 max-w-3xl mx-auto font-light leading-relaxed text-fade text-fade-2">
            Built with the knowledge of founders, creators, and specialists who dominate.
          </p>

          {/* Big Input Box */}
          <div className="max-w-3xl mx-auto mb-24 text-fade text-fade-3">
            <div className={`relative transition-all duration-500 ease-out ${isInputFocused ? 'scale-[1.02]' : 'scale-100'}`}>
              <input
                type="text"
                placeholder="Tell me your business idea..."
                value={businessIdea}
                onChange={(e) => setBusinessIdea(e.target.value)}
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => setIsInputFocused(false)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && businessIdea.trim()) {
                    router.push(`/start?idea=${encodeURIComponent(businessIdea)}`);
                  }
                }}
                className="w-full px-8 py-7 text-xl md:text-2xl bg-charcoal-800/40 border border-white/10 rounded-2xl text-white placeholder-silver-500 focus:outline-none focus:border-gold-500/40 focus:bg-charcoal-800/60 transition-all duration-500 backdrop-blur-xl font-light tracking-tight"
                style={{
                  boxShadow: isInputFocused ? '0 20px 60px -15px rgba(0, 0, 0, 0.5)' : 'none'
                }}
              />
              <button
                onClick={() => {
                  if (businessIdea.trim()) {
                    router.push(`/start?idea=${encodeURIComponent(businessIdea)}`);
                  }
                }}
                disabled={!businessIdea.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white hover:bg-silver-100 disabled:bg-charcoal-700 disabled:cursor-not-allowed text-black px-7 py-3.5 rounded-xl flex items-center gap-2 transition-all duration-300 group font-medium text-base"
              >
                Start
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            <p className="text-sm text-silver-600 mt-5 font-light">
              No credit card required • Results in minutes
            </p>
          </div>

          {/* Three Animated Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto text-fade text-fade-4">
            {/* Card 1: Business Case */}
            <div className="group relative bg-gradient-to-br from-charcoal-800/40 to-charcoal-900/20 border border-white/5 rounded-3xl p-10 hover:border-gold-500/30 transition-all duration-700 hover:scale-[1.03] hover:shadow-2xl hover:shadow-gold-500/10 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-gold-500/0 to-gold-500/0 group-hover:from-gold-500/5 group-hover:to-transparent rounded-3xl transition-all duration-700"></div>
              <div className="relative">
                <div className="w-14 h-14 bg-gold-500/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-gold-500/15 transition-all duration-500">
                  <TrendingUp className="h-7 w-7 text-gold-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4 tracking-tight">Business Case</h3>
                <p className="text-silver-500 leading-relaxed text-sm font-light">
                  Market positioning, pricing strategy, and competitive analysis tailored to your idea.
                </p>
              </div>
            </div>

            {/* Card 2: Content Strategy */}
            <div className="group relative bg-gradient-to-br from-charcoal-800/40 to-charcoal-900/20 border border-white/5 rounded-3xl p-10 hover:border-silver-400/30 transition-all duration-700 hover:scale-[1.03] hover:shadow-2xl hover:shadow-silver-400/10 backdrop-blur-sm md:mt-8">
              <div className="absolute inset-0 bg-gradient-to-br from-silver-400/0 to-silver-400/0 group-hover:from-silver-400/5 group-hover:to-transparent rounded-3xl transition-all duration-700"></div>
              <div className="relative">
                <div className="w-14 h-14 bg-silver-400/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-silver-400/15 transition-all duration-500">
                  <FileText className="h-7 w-7 text-silver-300" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4 tracking-tight">Content Strategy</h3>
                <p className="text-silver-500 leading-relaxed text-sm font-light">
                  30-day content calendar with viral hooks and channel-specific optimization.
                </p>
              </div>
            </div>

            {/* Card 3: Website */}
            <div className="group relative bg-gradient-to-br from-charcoal-800/40 to-charcoal-900/20 border border-white/5 rounded-3xl p-10 hover:border-white/20 transition-all duration-700 hover:scale-[1.03] hover:shadow-2xl hover:shadow-white/10 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/0 group-hover:from-white/5 group-hover:to-transparent rounded-3xl transition-all duration-700"></div>
              <div className="relative">
                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-white/15 transition-all duration-500">
                  <Globe className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4 tracking-tight">Website</h3>
                <p className="text-silver-500 leading-relaxed text-sm font-light">
                  Professional landing pages designed to convert visitors into customers.
                </p>
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 text-fade text-fade-5">
            <div className="animate-bounce">
              <ChevronDown className="h-6 w-6 text-silver-700" />
            </div>
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
            <div className="text-center p-10 rounded-3xl bg-charcoal-900/30 border border-white/5 hover:border-gold-500/20 transition-all duration-700 hover:scale-[1.02]">
              <div className="w-14 h-14 bg-gold-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Target className="h-7 w-7 text-gold-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-3 tracking-tight">Business Case</h3>
              <p className="text-silver-500 text-sm leading-relaxed font-light">
                Market positioning, pricing strategy, and competitive analysis tailored to your idea.
              </p>
            </div>

            <div className="text-center p-10 rounded-3xl bg-charcoal-900/30 border border-white/5 hover:border-silver-400/20 transition-all duration-700 hover:scale-[1.02]">
              <div className="w-14 h-14 bg-silver-400/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Zap className="h-7 w-7 text-silver-300" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-3 tracking-tight">Content Strategy</h3>
              <p className="text-silver-500 text-sm leading-relaxed font-light">
                30-day content calendar with viral hooks and channel-specific optimization.
              </p>
            </div>

            <div className="text-center p-10 rounded-3xl bg-charcoal-900/30 border border-white/5 hover:border-white/15 transition-all duration-700 hover:scale-[1.02]">
              <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Download className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-3 tracking-tight">Ready-to-Use Assets</h3>
              <p className="text-silver-500 text-sm leading-relaxed font-light">
                Download PDFs, templates, and resources you can use immediately.
              </p>
            </div>

            <div className="text-center p-10 rounded-3xl bg-charcoal-900/30 border border-white/5 hover:border-gold-500/20 transition-all duration-700 hover:scale-[1.02]">
              <div className="w-14 h-14 bg-gold-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Sparkles className="h-7 w-7 text-gold-400" />
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
          <div className="absolute top-0 left-0 w-96 h-96 bg-gold-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-silver-400 rounded-full blur-3xl"></div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative py-40 bg-gradient-to-b from-black via-charcoal-950 to-black">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-semibold text-white mb-6 tracking-tight">
              Simple, Fair Pricing
            </h2>
            <p className="text-xl text-silver-400 font-light">
              Choose the payment option that works for you
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="group bg-gradient-to-br from-charcoal-800/40 to-charcoal-900/20 rounded-3xl border border-white/10 p-12 hover:border-gold-500/30 transition-all duration-700 hover:scale-[1.02] backdrop-blur-sm relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-gold-500/0 to-gold-500/0 group-hover:from-gold-500/5 group-hover:to-transparent transition-all duration-700"></div>
              <div className="relative">
                <h3 className="text-2xl font-semibold text-white mb-4 tracking-tight">Pay Once</h3>
                <div className="text-6xl font-semibold text-white mb-8 tracking-tight">
                  £37
                  <span className="text-lg font-light text-silver-400">/one-time</span>
                </div>
                <p className="text-silver-400 mb-10 font-light">Perfect for immediate access to your complete launch kit</p>
                <ul className="space-y-4 mb-12">
                  <li className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-gold-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <div className="w-2 h-2 bg-gold-400 rounded-full"></div>
                    </div>
                    <span className="text-silver-300 text-sm font-light">Complete business case & strategy</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-gold-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <div className="w-2 h-2 bg-gold-400 rounded-full"></div>
                    </div>
                    <span className="text-silver-300 text-sm font-light">30-day content strategy</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-gold-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <div className="w-2 h-2 bg-gold-400 rounded-full"></div>
                    </div>
                    <span className="text-silver-300 text-sm font-light">Downloadable PDFs</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-gold-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <div className="w-2 h-2 bg-gold-400 rounded-full"></div>
                    </div>
                    <span className="text-silver-300 text-sm font-light">3 regenerations per section</span>
                  </li>
                </ul>
                <Link href="/start">
                  <Button 
                    className="w-full bg-white hover:bg-silver-100 text-black transition-all duration-300" 
                    size="lg"
                  >
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>

            <div className="group bg-gradient-to-br from-charcoal-800/60 to-charcoal-900/40 rounded-3xl border border-gold-500/20 p-12 hover:border-gold-500/40 transition-all duration-700 hover:scale-[1.02] backdrop-blur-sm relative overflow-hidden">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="bg-gradient-to-r from-gold-500 to-gold-400 text-black px-5 py-1.5 rounded-full text-xs font-semibold shadow-lg shadow-gold-500/30 tracking-wider">
                  FLEXIBLE
                </span>
              </div>
              
              <div className="absolute inset-0 bg-gradient-to-br from-gold-500/0 to-gold-500/0 group-hover:from-gold-500/10 group-hover:to-transparent transition-all duration-700"></div>
              
              <div className="relative">
                <h3 className="text-2xl font-semibold text-white mb-4 tracking-tight">Daily Plan</h3>
                <div className="text-6xl font-semibold text-white mb-8 tracking-tight">
                  £1
                  <span className="text-lg font-light text-silver-400">/day × 37</span>
                </div>
                <p className="text-silver-400 mb-10 font-light">Spread the cost over time, same great value</p>
                <ul className="space-y-4 mb-12">
                  <li className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-gold-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <div className="w-2 h-2 bg-gold-400 rounded-full"></div>
                    </div>
                    <span className="text-silver-300 text-sm font-light">Everything in Pay Once</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-gold-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <div className="w-2 h-2 bg-gold-400 rounded-full"></div>
                    </div>
                    <span className="text-silver-300 text-sm font-light">Cancel anytime</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-gold-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <div className="w-2 h-2 bg-gold-400 rounded-full"></div>
                    </div>
                    <span className="text-silver-300 text-sm font-light">Auto-ends after 37 days</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-gold-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <div className="w-2 h-2 bg-gold-400 rounded-full"></div>
                    </div>
                    <span className="text-silver-300 text-sm font-light">Same £37 total</span>
                  </li>
                </ul>
                <Link href="/start">
                  <Button 
                    variant="outline" 
                    className="w-full border border-gold-500/40 text-white hover:bg-gold-500/10 transition-all duration-300" 
                    size="lg"
                  >
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Background gradient - very subtle */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-3xl opacity-[0.03] pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gold-500 rounded-full blur-3xl"></div>
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
              className="px-10 py-7 text-lg bg-white hover:bg-silver-100 text-black shadow-2xl shadow-white/10 hover:scale-[1.03] transition-all duration-500 font-medium tracking-tight"
            >
              Create My Launch Kit Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>

        {/* Spotlight effect - very subtle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gold-500/[0.02] rounded-full blur-3xl pointer-events-none"></div>
      </section>

      {/* Footer */}
      <footer className="relative bg-black border-t border-white/5 py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-16">
            <div className="flex items-center gap-2.5 mb-8 md:mb-0">
              <Sparkles className="h-6 w-6 text-gold-500" />
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
