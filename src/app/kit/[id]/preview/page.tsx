'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Check, Lock, Sparkles } from 'lucide-react';

interface KitData {
  id: string;
  title: string;
  one_liner: string;
  has_access: boolean;
}

export default function KitPreviewPage({ params }: { params: { id: string } }) {
  const [kit, setKit] = useState<KitData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<'oneoff' | 'subscription'>('oneoff');

  // Check for payment success in URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'true') {
      // Redirect to dashboard after successful payment
      setTimeout(() => {
        window.location.href = `/kit/${params.id}/dashboard`;
      }, 2000);
    }
  }, [params.id]);

  useEffect(() => {
    const fetchKit = async () => {
      try {
        const response = await fetch(`/api/kits/${params.id}`);
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

    fetchKit();
  }, [params.id]);

  const handlePayment = async () => {
    try {
      // For testing without Stripe, directly grant access
      const testMode = !process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
      
      if (testMode) {
        // Test mode: directly grant access and redirect
        const response = await fetch(`/api/kits/${params.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ has_access: true }),
        });
        
        if (response.ok) {
          window.location.href = `/kit/${params.id}/preview?success=true`;
        } else {
          throw new Error('Failed to grant test access');
        }
        return;
      }

      // Production mode: use Stripe
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          kitId: params.id,
          planType: selectedPlan,
          // TODO: Add actual userId when auth is implemented
          userId: undefined,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { url } = await response.json();
      
      // Redirect to Stripe checkout
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Something went wrong with the payment. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading your kit...</p>
        </div>
      </div>
    );
  }

  if (!kit) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Kit not found</h1>
          <p className="text-gray-600 mt-2">The kit you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  // Check for success message
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('success') === 'true') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
          <p className="text-gray-600 mb-4">Redirecting you to your launch kit dashboard...</p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  // If user already has access, redirect to dashboard
  if (kit.has_access) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">You already have access!</h1>
          <p className="text-gray-600 mb-4">Redirecting you to your dashboard...</p>
          <Button onClick={() => window.location.href = `/kit/${params.id}/dashboard`}>
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">LaunchKit AI</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content - Kit Preview */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="h-6 w-6 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">Your Launch Kit</h2>
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{kit.title}</h3>
              <p className="text-gray-600 mb-6">{kit.one_liner}</p>
              
              {/* Content Teasers */}
              <div className="space-y-6">
                
                {/* Business Case Teaser */}
                <div className="relative">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-gray-900">📊 Business Case & Strategy</h4>
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    
                    <div className="space-y-3 text-sm text-gray-600">
                      <div className="blur-sm select-none">
                        <p>Your positioning strategy leverages the growing demand for...</p>
                        <p>Target audience analysis reveals 3 key segments...</p>
                        <p>Recommended pricing structure: £X for premium tier...</p>
                      </div>
                    </div>
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent rounded-lg"></div>
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                        Coming Soon
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content Strategy Teaser */}
                <div className="relative">
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-gray-900">📱 Content Strategy</h4>
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    
                    <div className="space-y-3 text-sm text-gray-600">
                      <div className="blur-sm select-none">
                        <p>30-day content calendar with daily post ideas...</p>
                        <p>7 viral hook templates for your niche...</p>
                        <p>Channel-specific optimization for Instagram and...</p>
                      </div>
                    </div>
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent rounded-lg"></div>
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-green-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                        Coming Soon
                      </span>
                    </div>
                  </div>
                </div>

                {/* Templates Library Teaser */}
                <div className="relative">
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-gray-900">📄 Templates Library</h4>
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    
                    <div className="space-y-3 text-sm text-gray-600">
                      <div className="blur-sm select-none">
                        <p>Email templates for customer outreach...</p>
                        <p>Social media post templates...</p>
                        <p>Pitch deck templates for investors...</p>
                      </div>
                    </div>
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent rounded-lg"></div>
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                        Coming Soon
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Payment Options */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Your Plan</h3>
              
              <div className="space-y-4">
                {/* One-off Plan */}
                <div 
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                    selectedPlan === 'oneoff' 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedPlan('oneoff')}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">Pay Once</h4>
                    <div className="text-2xl font-bold text-gray-900">£37</div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">Get immediate access to your complete launch kit</p>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      Complete business case
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      30-day content strategy
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      Downloadable PDFs
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      3 regenerations per section
                    </li>
                  </ul>
                </div>

                {/* Subscription Plan */}
                <div 
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                    selectedPlan === 'subscription' 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedPlan('subscription')}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">Daily Plan</h4>
                    <div className="text-2xl font-bold text-gray-900">£1<span className="text-sm font-normal">/day</span></div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">Pay as you go for 37 days (£37 total)</p>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      Same features as pay once
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      Spread the cost over time
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      Cancel anytime
                    </li>
                  </ul>
                </div>
              </div>

              <Button 
                onClick={handlePayment}
                className="w-full mt-6"
                size="lg"
              >
                {selectedPlan === 'oneoff' ? 'Pay £37 Now' : 'Start £1/day Plan'}
              </Button>

              <p className="text-xs text-gray-500 text-center mt-3">
                Secure payment powered by Stripe
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
