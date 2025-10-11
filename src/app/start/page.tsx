'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ConversationalIntake from '@/components/ConversationalIntake';

export default function StartPage() {
  const [showIntake, setShowIntake] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Check if user came from homepage with a business idea
  useEffect(() => {
    const idea = searchParams.get('idea');
    if (idea) {
      setShowIntake(true);
    }
  }, [searchParams]);

  const handleIntakeComplete = async (data: any) => {
    try {
      // Create a new kit with the gathered data
      const response = await fetch('/api/kits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessIdea: data.businessIdea,
          targetAudience: data.targetAudience,
          problemSolution: data.problemSolution,
          revenueModel: data.revenueModel,
          competitiveAdvantage: data.competitiveAdvantage,
          timeline: data.timeline,
          biggestChallenge: data.biggestChallenge,
          successGoals: data.successGoals,
        }),
      });

      const kit = await response.json();
      
      // Redirect to the kit's teaser page
      router.push(`/kit/${kit.id}/teaser`);
    } catch (error) {
      console.error('Error creating kit:', error);
      // Handle error - maybe show a message to the user
    }
  };

  if (showIntake) {
    const initialIdea = searchParams.get('idea');
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-dark to-black">
        <div className="container mx-auto px-4 py-16">
          <ConversationalIntake 
            onComplete={handleIntakeComplete} 
            initialBusinessIdea={initialIdea}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-dark to-black">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-6">
            Everything you need to go from{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-mint-400 to-mint-600">
              0 → 6/7 figures
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Built with the knowledge of founders, creators, and specialists who dominate.
          </p>
          <p className="text-gray-400 mb-12">
            No credit card required • Results in minutes • No subscriptions, no hidden fees
          </p>
        </div>

        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-gradient-to-br from-dark to-black rounded-2xl p-8 border border-mint-600/20 mb-8 hover:border-mint-500/40 transition-all duration-300">
            <h2 className="text-2xl font-semibold text-white mb-4">
              Let&apos;s create your business roadmap
            </h2>
            <p className="text-gray-300 mb-6">
              I&apos;ll ask you a few questions about your business idea to create a personalized plan just for you.
            </p>
            <button
              onClick={() => setShowIntake(true)}
              className="bg-gradient-to-r from-mint-500 to-mint-600 hover:from-mint-600 hover:to-mint-700 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-all duration-300 shadow-lg shadow-mint-500/25 hover:shadow-mint-500/40 hover:scale-105"
            >
              Start Your Business Kit →
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="bg-dark rounded-xl p-6 border border-mint-600/20 hover:border-mint-500/40 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-mint-500/10 group cursor-pointer">
              <div className="w-12 h-12 bg-mint-500/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-mint-500/30 transition-colors duration-300">
                <svg className="w-6 h-6 text-mint-400 group-hover:text-mint-300 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Business Case</h3>
              <p className="text-gray-400 text-sm">
                Market positioning, pricing strategy, and competitive analysis tailored to your idea.
              </p>
            </div>

            <div className="bg-dark rounded-xl p-6 border border-mint-600/20 hover:border-mint-500/40 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-mint-500/10 group cursor-pointer">
              <div className="w-12 h-12 bg-mint-500/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-mint-500/30 transition-colors duration-300">
                <svg className="w-6 h-6 text-mint-400 group-hover:text-mint-300 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Content Strategy</h3>
              <p className="text-gray-400 text-sm">
                30-day content calendar with viral hooks and channel-specific optimization.
              </p>
            </div>

            <div className="bg-dark rounded-xl p-6 border border-mint-600/20 hover:border-mint-500/40 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-mint-500/10 group cursor-pointer">
              <div className="w-12 h-12 bg-mint-500/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-mint-500/30 transition-colors duration-300">
                <svg className="w-6 h-6 text-mint-400 group-hover:text-mint-300 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Website Template</h3>
              <p className="text-gray-400 text-sm">
                Custom landing page optimized for conversions and your brand.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}