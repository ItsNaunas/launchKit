'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';

interface KitData {
  id: string;
  businessIdea: string;
  targetAudience: string;
  problemSolution: string;
  revenueModel: string;
  competitiveAdvantage: string;
  timeline: string;
  biggestChallenge: string;
  successGoals: string;
}

export default function TeaserPage() {
  const params = useParams();
  const router = useRouter();
  const [kit, setKit] = useState<KitData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchKit(params.id as string);
    }
  }, [params.id]);

  const fetchKit = async (kitId: string) => {
    try {
      const response = await fetch(`/api/kits/${kitId}`);
      if (response.ok) {
        const kitData = await response.json();
        setKit(kitData);
      }
    } catch (error) {
      console.error('Error fetching kit:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckout = () => {
    router.push(`/kit/${params.id}/checkout`);
  };

  const handleViewDashboard = () => {
    router.push(`/kit/${params.id}/tabs`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-mint-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-300">Loading your business kit...</p>
        </div>
      </div>
    );
  }

  if (!kit) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Kit not found</h1>
          <p className="text-gray-300 mb-8">The business kit you're looking for doesn't exist.</p>
          <Button onClick={() => router.push('/start')} className="bg-gradient-to-r from-mint-500 to-mint-600 hover:from-mint-600 hover:to-mint-700 text-white">
            Create New Kit
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-dark to-black">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-gradient-to-r from-mint-500 to-mint-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">
              Your Business Kit is Ready!
            </h1>
            <p className="text-xl text-gray-300 mb-2">
              I've analyzed your business idea: <span className="text-mint-500 font-semibold">"{kit.businessIdea}"</span>
            </p>
            <p className="text-gray-400">
              Here's what I've prepared for you...
            </p>
          </div>

          {/* Business Summary */}
          <div className="bg-gradient-to-br from-dark to-black rounded-2xl p-8 mb-8 border border-mint-600/20">
            <h2 className="text-2xl font-semibold text-white mb-6">Your Business Summary</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-mint-500 mb-2">Target Audience</h3>
                <p className="text-gray-300 mb-4">{kit.targetAudience}</p>
                
                <h3 className="text-lg font-medium text-mint-600 mb-2">Problem You Solve</h3>
                <p className="text-gray-300">{kit.problemSolution}</p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-mint-400 mb-2">Revenue Model</h3>
                <p className="text-gray-300 mb-4">{kit.revenueModel}</p>
                
                <h3 className="text-lg font-medium text-mint-300 mb-2">Timeline</h3>
                <p className="text-gray-300">{kit.timeline}</p>
              </div>
            </div>
          </div>

          {/* What's Included */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-white text-center mb-8">What's Included in Your Kit</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              {/* Business Case Preview */}
              <div className="bg-dark rounded-xl p-6 border border-mint-600/20 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-mint-500/10 to-mint-600/10"></div>
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-mint-500/20 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-mint-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">Business Case</h3>
                  <p className="text-gray-300 text-sm mb-4">
                    Market positioning, pricing strategy, and competitive analysis tailored to your idea.
                  </p>
                  <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-2">
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <p className="text-gray-400 text-sm">Unlock to see full analysis</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content Strategy Preview */}
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-teal-600/10"></div>
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">Content Strategy</h3>
                  <p className="text-gray-300 text-sm mb-4">
                    30-day content calendar with viral hooks and channel-specific optimization.
                  </p>
                  <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-2">
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <p className="text-gray-400 text-sm">Unlock to see full strategy</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Website Preview */}
              <div className="bg-dark rounded-xl p-6 border border-mint-600/20 relative overflow-hidden hover:border-mint-500/40 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-mint-500/10 to-mint-600/10"></div>
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-mint-500/20 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-mint-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">Website Template</h3>
                  <p className="text-gray-300 text-sm mb-4">
                    Custom landing page optimized for conversions and your brand.
                  </p>
                  <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-2">
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <p className="text-gray-400 text-sm">Unlock to see full template</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <div className="bg-gradient-to-r from-mint-500 to-mint-600 rounded-2xl p-8 mb-8">
              <h3 className="text-3xl font-bold text-white mb-4">Unlock Your Complete Business Kit</h3>
              <p className="text-white/90 mb-6 text-lg">
                Get instant access to your personalized roadmap and start building your business today
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button 
                  onClick={handleCheckout}
                  size="lg"
                  className="bg-white text-gray-900 hover:bg-gray-100 font-semibold px-8 py-4 text-lg"
                >
                  Unlock Now - £37
                </Button>
                <Button 
                  onClick={handleViewDashboard}
                  variant="outline"
                  size="lg"
                  className="border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg"
                >
                  View Dashboard
                </Button>
              </div>
              <p className="text-blue-200 text-sm mt-6">
                No subscriptions • Instant access • Money-back guarantee
              </p>
            </div>

            {/* Trust Signals */}
            <div className="flex flex-wrap justify-center gap-8 text-gray-400 text-sm">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Secure Payment
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Instant Access
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                Money-back Guarantee
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}