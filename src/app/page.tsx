'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';
import { Sparkles, Target, Zap, Download, LogOut, ChevronDown, Globe, FileText, TrendingUp, ArrowRight, Check, Star, Users, Clock, Shield, Play, ChevronRight } from 'lucide-react';
import Pricing from '@/components/Pricing';
import { VercelV0Chat } from '@/components/VercelV0Chat';
import { WavyBackground } from '@/components/ui/wavy-background';

export default function HomePage() {
  const { user, signOut } = useAuth();
  const [showStickyCTA, setShowStickyCTA] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  // Sticky CTA on scroll
  useEffect(() => {
    const handleScroll = () => {
      setShowStickyCTA(window.scrollY > 800);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-rotate how it works steps
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">

      {/* Interactive Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-dark"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-mint-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-mint-600/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Minimal Header - CRO Optimized */}
      <header className="relative z-50 border-b border-white/5 bg-black/70 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Sparkles className="h-6 w-6 text-mint-500" />
              <h1 className="text-xl font-semibold text-white tracking-tight">LaunchKit AI</h1>
            </div>
            {user ? (
              <div className="flex items-center gap-4">
                <Link href="/dashboard">
                  <Button variant="outline" size="sm" className="border-mint-600/30 text-gray-300 hover:text-mint-500 hover:bg-mint-600/10 transition-all duration-300">
                    Dashboard
                  </Button>
                </Link>
                <Button variant="outline" size="sm" onClick={signOut} className="border-mint-600/30 text-gray-300 hover:text-mint-500 hover:bg-mint-600/10 transition-all duration-300">
                  <LogOut className="h-4 w-4 mr-1.5" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <Link href="/auth/signin" className="text-sm text-gray-400 hover:text-mint-500 transition-colors duration-300">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Sticky CTA Bar */}
      <div className={`fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-mint-500/30 transform transition-transform duration-300 ${showStickyCTA ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-mint-500" />
            <span className="text-sm text-white font-medium">Get Your Free Launch Kit in 60 Seconds</span>
          </div>
          <Link href="/start">
            <Button size="sm" className="bg-gradient-to-r from-mint-500 to-mint-600 text-black hover:from-mint-600 hover:to-mint-700 transition-all duration-300 shadow-lg shadow-mint-500/25 font-semibold">
              Start Free Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Hero Section - CRO Optimized */}
      <section className="relative min-h-screen overflow-hidden bg-black">
        {/* Content */}
        <div className="relative z-10 min-h-screen flex items-center justify-center pt-24 pb-32">
          <div className="max-w-5xl mx-auto px-6 lg:px-8 text-center">
            
            {/* Trust Strip */}
            <div className="flex items-center justify-center gap-6 mb-8 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-mint-500" />
                <span>100% Free</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-mint-500" />
                <span>Ready in 60 seconds</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-mint-500" />
                <span>No credit card required</span>
              </div>
            </div>

            {/* Main Headline - ≤12 words, clear product + benefit */}
            <div className="relative mb-6 overflow-hidden">
              <div className="absolute inset-0 z-0">
                <WavyBackground
                  colors={["#1DCD9F", "#2dd4bf", "#5eead4", "#99f6e4", "#ccfbf1"]}
                  waveOpacity={0.5}
                  blur={30}
                  speed="slow"
                  backgroundFill="transparent"
                  className="w-full h-full"
                  containerClassName="w-full h-full"
                />
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-clash font-semibold text-white leading-[1.1] tracking-tight relative z-10 mb-6">
                Get Your Complete{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-mint-400 via-mint-500 to-mint-600">
                  Launch Strategy
                </span>
                {' '}in Minutes
              </h1>
            </div>
            
            {/* Subheadline - ≤20 words, expands value */}
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto font-light leading-relaxed">
              AI-powered business case, content strategy, and landing page—tailored to your idea. Free forever.
            </p>

            {/* Primary CTA - Action-first, "free" emphasized */}
            <div className="mb-6">
              <Link href="/start">
                <Button 
                  size="lg" 
                  className="px-12 py-7 text-lg bg-gradient-to-r from-mint-500 to-mint-600 text-black hover:from-mint-600 hover:to-mint-700 shadow-2xl shadow-mint-500/30 font-semibold tracking-tight transform hover:scale-105 transition-all duration-300"
                >
                  Get My Free Launch Kit
                  <ArrowRight className="ml-3 h-6 w-6" />
                </Button>
              </Link>
            </div>

            {/* CTA Microcopy */}
            <p className="text-sm text-gray-500 mb-8">
              No credit card • Takes under 60 seconds • Cancel anytime
            </p>

            {/* Social Proof */}
            <div className="flex items-center justify-center gap-8 mb-16">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-mint-400 to-mint-600 border-2 border-black"></div>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-black"></div>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 border-2 border-black"></div>
                </div>
                <span className="text-sm text-gray-400">
                  <strong className="text-white">500+</strong> founders launched
                </span>
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-mint-500 text-mint-500" />
                ))}
                <span className="text-sm text-gray-400 ml-2">
                  4.9/5 rating
                </span>
              </div>
            </div>

            {/* Interactive Chat */}
            <div className="mb-16">
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

      {/* How It Works - Interactive */}
      <section className="relative py-32 bg-gradient-to-b from-black via-dark to-black">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-semibold text-white mb-6 tracking-tight">
              From Idea to Launch in 3 Steps
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              No complex setup. No learning curve. Just results.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              { num: 1, title: "Share Your Idea", desc: "Tell us about your business in a simple conversation. No business plan required.", icon: Play },
              { num: 2, title: "AI Builds Your Kit", desc: "Our AI analyzes your idea and generates a complete launch strategy in 60 seconds.", icon: Sparkles },
              { num: 3, title: "Launch & Iterate", desc: "Get your business case, content plan, and website. Refine anything with 1-click.", icon: TrendingUp }
            ].map((step, idx) => {
              const Icon = step.icon;
              return (
                <div 
                  key={idx}
                  onClick={() => setActiveStep(idx)}
                  className={`relative p-8 rounded-2xl border cursor-pointer transition-all duration-300 ${
                    activeStep === idx 
                      ? 'bg-mint-500/10 border-mint-500/50 scale-105 shadow-2xl shadow-mint-500/20' 
                      : 'bg-charcoal-900/30 border-white/5 hover:border-mint-500/30'
                  }`}
                >
                  <div className={`absolute -top-4 -left-4 w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 ${
                    activeStep === idx 
                      ? 'bg-gradient-to-br from-mint-500 to-mint-600 text-black' 
                      : 'bg-charcoal-800 text-gray-400'
                  }`}>
                    {step.num}
                  </div>
                  <Icon className={`h-10 w-10 mb-4 transition-colors duration-300 ${
                    activeStep === idx ? 'text-mint-400' : 'text-gray-500'
                  }`} />
                  <h3 className="text-xl font-semibold text-white mb-3">{step.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
                </div>
              );
            })}
          </div>

          <div className="text-center">
            <Link href="/start">
              <Button size="lg" className="bg-gradient-to-r from-mint-500 to-mint-600 text-black hover:from-mint-600 hover:to-mint-700 shadow-xl shadow-mint-500/25 font-semibold px-10 py-6">
                Start Building Now — Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <p className="text-sm text-gray-500 mt-4">Takes less than 60 seconds • No signup required</p>
          </div>
        </div>
      </section>

      {/* Testimonials & Social Proof */}
      <section className="relative py-32 bg-gradient-to-b from-black via-charcoal-950 to-black">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-semibold text-white mb-6">
              Trusted by Founders Everywhere
            </h2>
            <div className="flex items-center justify-center gap-2 text-gray-400">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-mint-500 text-mint-500" />
                ))}
              </div>
              <span className="font-semibold">4.9/5</span>
              <span>from 500+ reviews</span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              { quote: "This saved me 3 months of planning. Got my business case and content strategy in minutes. Actually launched because of this.", name: "Sarah Chen", role: "SaaS Founder", result: "$10K MRR in 3 months" },
              { quote: "I had the idea but no clue where to start. LaunchKit gave me a clear roadmap and the confidence to execute. Already got my first 50 customers.", name: "Marcus Rivera", role: "E-commerce Startup", result: "50 customers in 6 weeks" },
              { quote: "The content calendar alone is worth 10x what I paid. The AI actually understands my niche and generates hooks that work.", name: "Emily Watson", role: "Content Creator", result: "100K followers gained" }
            ].map((testimonial, idx) => (
              <div key={idx} className="bg-charcoal-900/40 border border-mint-500/20 rounded-2xl p-8 hover:border-mint-500/40 transition-all duration-300">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-mint-500 text-mint-500" />
                  ))}
                </div>
                <p className="text-gray-300 mb-6 leading-relaxed">&quot;{testimonial.quote}&quot;</p>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-white font-semibold">{testimonial.name}</p>
                    <p className="text-gray-500 text-sm">{testimonial.role}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-mint-400 font-semibold text-sm">{testimonial.result}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Usage Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { num: "500+", label: "Founders Launched" },
              { num: "5K+", label: "Kits Generated" },
              { num: "50K+", label: "Content Pieces Created" },
              { num: "4.9/5", label: "Average Rating" }
            ].map((stat, idx) => (
              <div key={idx} className="p-6 bg-charcoal-900/30 border border-white/5 rounded-xl">
                <p className="text-4xl font-bold text-mint-400 mb-2">{stat.num}</p>
                <p className="text-gray-400 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section - Interactive */}
      <section className="relative py-32 bg-gradient-to-b from-black via-dark to-black">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-semibold text-white mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-400">
              Everything you need to know about LaunchKit AI
            </p>
          </div>

          <div className="space-y-4">
            {[
              { q: "Is LaunchKit really free?", a: "Yes! You can create your first launch kit completely free. No credit card required. Premium features like advanced website customization and extra regenerations are available for those who need them." },
              { q: "How long does it take to generate my kit?", a: "About 60 seconds. Once you complete the quick intake conversation, our AI generates your complete business case, content strategy, and landing page in under a minute." },
              { q: "What if I don't like the results?", a: "You can regenerate any section up to 3 times for free. Each regeneration takes the same amount of time and you can refine specific parts without starting over." },
              { q: "Do I need business experience to use this?", a: "Not at all. LaunchKit is designed for first-time founders. Our AI asks simple questions and generates professional strategies even if you're completely new to business." },
              { q: "Can I download and use the content?", a: "Absolutely. Everything we generate is yours to keep and use however you want. Download PDFs, copy content, export your landing page—it's all yours." },
              { q: "What makes LaunchKit different from ChatGPT?", a: "LaunchKit is specifically trained on successful launch strategies from founders who've scaled to millions. It's not generic advice—it's battle-tested frameworks tailored to your specific idea." }
            ].map((faq, idx) => (
              <div key={idx} className="border border-white/5 rounded-xl overflow-hidden bg-charcoal-900/30 hover:border-mint-500/30 transition-all duration-300">
                <button
                  onClick={() => setOpenFAQ(openFAQ === idx ? null : idx)}
                  className="w-full px-8 py-6 flex items-center justify-between text-left"
                >
                  <span className="text-lg font-semibold text-white">{faq.q}</span>
                  <ChevronRight className={`h-5 w-5 text-gray-400 transition-transform duration-300 ${openFAQ === idx ? 'rotate-90' : ''}`} />
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${openFAQ === idx ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="px-8 pb-6 text-gray-400 leading-relaxed">
                    {faq.a}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Link href="/start">
              <Button size="lg" className="bg-gradient-to-r from-mint-500 to-mint-600 text-black hover:from-mint-600 hover:to-mint-700 shadow-xl shadow-mint-500/25 font-semibold px-10 py-6">
                Get Started Free — No Risk
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <p className="text-sm text-gray-500 mt-4">Join 500+ founders who&apos;ve already launched</p>
          </div>
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

      {/* Final CTA Section - High-Impact */}
      <section className="relative py-40 bg-gradient-to-b from-black via-charcoal-950 to-black">
        <div className="max-w-5xl mx-auto px-6 lg:px-8 text-center relative z-10">
          <div className="bg-gradient-to-br from-mint-500/10 to-mint-600/5 border border-mint-500/30 rounded-3xl p-12 md:p-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-white mb-6 tracking-tight leading-tight">
              Stop Planning. Start Launching.
            </h2>
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              Get everything you need to go from idea to launch in the next 60 seconds. Completely free.
            </p>

            {/* Value Props */}
            <div className="grid md:grid-cols-3 gap-6 mb-10">
              {[
                { icon: Check, text: "Complete Business Case" },
                { icon: Check, text: "30-Day Content Strategy" },
                { icon: Check, text: "Professional Landing Page" }
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="flex items-center gap-2 justify-center text-gray-300">
                    <Icon className="h-5 w-5 text-mint-400 flex-shrink-0" />
                    <span className="font-medium">{item.text}</span>
                  </div>
                );
              })}
            </div>

            <Link href="/start">
              <Button 
                size="lg" 
                className="px-12 py-7 text-xl bg-gradient-to-r from-mint-500 to-mint-600 hover:from-mint-600 hover:to-mint-700 text-black shadow-2xl shadow-mint-500/30 font-bold tracking-tight transform hover:scale-105 transition-all duration-300"
              >
                Get My Free Launch Kit Now
                <ArrowRight className="ml-3 h-6 w-6" />
              </Button>
            </Link>

            <p className="text-sm text-gray-500 mt-6">
              <strong className="text-white">No credit card</strong> • <strong className="text-white">No signup</strong> • <strong className="text-white">No commitment</strong>
            </p>

            {/* Trust Signals */}
            <div className="mt-10 pt-8 border-t border-white/10 flex flex-wrap items-center justify-center gap-8 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-mint-500" />
                <span>500+ Founders Trust Us</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-mint-500 fill-mint-500" />
                <span>4.9/5 Average Rating</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-mint-500" />
                <span>GDPR Compliant</span>
              </div>
            </div>
          </div>
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
