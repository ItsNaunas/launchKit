'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Sparkles, Target, Zap, Download, TrendingUp, ArrowRight, Check, Star, Clock, Shield, Play, ChevronRight } from 'lucide-react';
import Pricing from '@/components/Pricing';
import { VercelV0Chat } from '@/components/VercelV0Chat';
// import { LampContainer } from '@/components/ui/lamp';
import { CustomNavbar } from '@/components/CustomNavbar';
import { WavyBackground } from '@/components/ui/wavy-background';

export default function HomePage() {
  const [activeStep, setActiveStep] = useState(0);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

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

      {/* New Resizable Navbar */}
      <CustomNavbar />


      {/* Hero Section - Wavy Background */}
      <WavyBackground
        containerClassName=""
        className="max-w-5xl mx-auto px-6"
        colors={["#1dcd9f", "#10b981", "#059669", "#047857", "#065f46"]}
        waveWidth={60}
        backgroundFill="#000000"
        blur={12}
        speed="fast"
        waveOpacity={0.3}
      >
        <div className="w-full text-center">
          {/* Main Headline */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-clash font-semibold text-white leading-[1.1] tracking-tight mb-6">
            Everything you need to go from{' '}
            <span className="bg-gradient-to-r from-mint-400 via-mint-500 to-mint-600 bg-clip-text text-transparent">
              0 → 6/7 figures
            </span>
            .
          </h1>
          
          {/* Subheadline */}
          <div className="text-xl md:text-2xl text-white mb-16 max-w-3xl mx-auto space-y-4">
            <p className="font-light leading-relaxed">
              Built with the knowledge of founders, creators, and specialists who dominate.
            </p>
            <p className="font-light leading-relaxed">
              The world&apos;s next rise of millionaires begins here.
            </p>
            <p className="font-semibold text-mint-400 text-2xl md:text-3xl">
              Welcome to Project 67.
            </p>
          </div>

          {/* Interactive Chat - Primary CTA */}
          <div className="mb-16">
            <VercelV0Chat />
          </div>

          {/* Social Proof - Agency Testimonials */}
          <div className="max-w-4xl mx-auto">
            <p className="text-sm text-gray-400 mb-8 uppercase tracking-wider">Trusted by entrepreneurs and agencies</p>
            
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {/* Agency Testimonial 1 */}
              <div className="bg-charcoal-900/40 border border-mint-500/20 rounded-2xl p-8 text-left">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-mint-500 text-mint-500" />
                  ))}
                </div>
                <p className="text-gray-300 mb-6 leading-relaxed text-sm">
                  &quot;Working with this team transformed our client acquisition. Their strategic approach and execution helped us scale from 5 to 25 clients in 6 months.&quot;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-mint-400 to-mint-600"></div>
                  <div>
                    <p className="text-white font-semibold text-sm">Digital Agency Client</p>
                    <p className="text-gray-500 text-xs">Marketing Agency</p>
                  </div>
                </div>
              </div>

              {/* Agency Testimonial 2 */}
              <div className="bg-charcoal-900/40 border border-mint-500/20 rounded-2xl p-8 text-left">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-mint-500 text-mint-500" />
                  ))}
                </div>
                <p className="text-gray-300 mb-6 leading-relaxed text-sm">
                  &quot;The content strategies they develop actually convert. We&apos;ve seen a 3x increase in engagement and our clients are getting real results.&quot;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600"></div>
                  <div>
                    <p className="text-white font-semibold text-sm">Social Media Agency</p>
                    <p className="text-gray-500 text-xs">Content Marketing</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-400 pt-8 border-t border-white/5">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-mint-500" />
                <span>100% Free to Start</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-mint-500" />
                <span>Results in 60 Seconds</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-mint-500" />
                <span>No Credit Card Required</span>
              </div>
            </div>
          </div>
        </div>
      </WavyBackground>

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
      <section id="how-it-works" className="relative py-32 bg-gradient-to-b from-black via-dark to-black">
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

      {/* What You Get */}
      <section className="relative py-32 bg-gradient-to-b from-black via-charcoal-950 to-black">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-semibold text-white mb-6">
              Built by Experts Who&apos;ve Done It
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Combining years of agency experience in digital marketing and content strategy
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Value Prop 1 */}
            <div className="bg-charcoal-900/40 border border-mint-500/20 rounded-2xl p-10">
              <div className="w-14 h-14 bg-mint-500/10 rounded-2xl flex items-center justify-center mb-6">
                <Target className="h-7 w-7 text-mint-400" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">Strategic Marketing Expertise</h3>
              <p className="text-gray-400 leading-relaxed mb-4">
                Our team has helped agencies scale from 5 to 25+ clients through proven positioning, messaging, and acquisition strategies.
              </p>
              <ul className="space-y-2">
                {['Market positioning frameworks', 'Competitive analysis', 'Pricing strategy', 'Go-to-market plans'].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-gray-300 text-sm">
                    <Check className="h-4 w-4 text-mint-500 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Value Prop 2 */}
            <div className="bg-charcoal-900/40 border border-mint-500/20 rounded-2xl p-10">
              <div className="w-14 h-14 bg-mint-500/10 rounded-2xl flex items-center justify-center mb-6">
                <Zap className="h-7 w-7 text-mint-400" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">Content That Converts</h3>
              <p className="text-gray-400 leading-relaxed mb-4">
                Backed by a social media marketing agency that&apos;s driven 3x engagement increases and real ROI for clients across industries.
              </p>
              <ul className="space-y-2">
                {['Viral content frameworks', 'Platform-specific optimization', 'Engagement strategies', 'Content calendars'].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-gray-300 text-sm">
                    <Check className="h-4 w-4 text-mint-500 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
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
            <p className="text-sm text-gray-500 mt-4">Start your launch journey in 60 seconds</p>
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
                <Check className="h-4 w-4 text-mint-500" />
                <span>Instant Access</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-mint-500" />
                <span>Secure & Private</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-mint-500" />
                <span>AI-Powered</span>
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
