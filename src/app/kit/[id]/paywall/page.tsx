'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Check, Clock, Users, Shield, Star } from 'lucide-react';
import { type KitData } from '@/lib/shared-types';

export default function PaywallPage({ params }: { params: Promise<{ id: string }> }) {
  const [kit, setKit] = useState<KitData | null>(null);
  const [kitId, setKitId] = useState<string>('');
  const [selectedPlan, setSelectedPlan] = useState<'oneoff' | 'subscription'>('oneoff');
  const [isLoading, setIsLoading] = useState(true);
  const [dailyCount, setDailyCount] = useState(0);

  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params;
      setKitId(resolvedParams.id);
    };
    
    resolveParams();
  }, [params]);

  useEffect(() => {
    if (!kitId) return;
    
    const fetchData = async () => {
      try {
        // Fetch kit data
        const kitResponse = await fetch(`/api/kits/${kitId}`);
        if (kitResponse.ok) {
          const kitData = await kitResponse.json();
          setKit(kitData);
        }

        // Show fake scarcity for conversion optimization
        const fakeCount = Math.floor(Math.random() * 15) + 35; // Random between 35-49
        setDailyCount(fakeCount);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [kitId]);

  const handlePayment = async () => {
    setIsLoading(true);
    try {
      // BYPASS PAYMENT - Go directly to dashboard for development
      console.log('Payment bypassed - going directly to dashboard');
      
      // Update kit to have access (bypass payment)
      await fetch(`/api/kits/${kitId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          has_access: true,
          checkout_completed_at: new Date().toISOString()
        }),
      });
      
      // Redirect to dashboard
      window.location.href = `/kit/${kitId}/tabs`;
    } catch (error) {
      console.error('Error:', error);
      // Still redirect even if API call fails
      window.location.href = `/kit/${kitId}/tabs`;
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-mint-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!kit) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Kit not found</h1>
          <p className="text-gray-600 mt-2">The kit you&apos;re looking for doesn&apos;t exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">{kit.title}</h1>
            <p className="text-gray-600">{kit.one_liner}</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Scarcity Message */}
        <div className="text-center mb-8">
          <div className="bg-mint-50 border border-mint-200 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Clock className="h-5 w-5 text-mint-600" />
              <span className="text-lg font-semibold text-mint-800">Limited Daily Capacity</span>
            </div>
            <p className="text-mint-700">
              We process <strong>50 Starter Kits per day</strong> to ensure quality and personalization.
              <span className="block mt-2">
                <strong>{50 - dailyCount} slots remaining</strong> for today.
              </span>
            </p>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Secure Your Spot Now
          </h2>
          <p className="text-lg text-gray-600">
            Get your complete launch strategy, content plan, and website ready in minutes.
          </p>
        </div>

        {/* What You'll Get */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">What You&apos;ll Receive</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-mint-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Check className="h-6 w-6 text-mint-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Business Case PDF</h4>
              <p className="text-sm text-gray-600">
                Positioning, pricing strategy, target audience analysis, and 3 actionable next steps
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Content Strategy PDF</h4>
              <p className="text-sm text-gray-600">
                30-day content calendar, 7 viral hooks, platform-specific guidance, and posting schedule
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-mint-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Star className="h-6 w-6 text-mint-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Live Website</h4>
              <p className="text-sm text-gray-600">
                Professional one-pager hosted at your subdomain, ready to customize and publish
              </p>
            </div>
          </div>
        </div>

        {/* Pricing Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* One-off Payment */}
          <div 
            className={`border-2 rounded-lg p-6 cursor-pointer transition-colors ${
              selectedPlan === 'oneoff' 
                ? 'border-mint-500 bg-mint-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setSelectedPlan('oneoff')}
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xl font-semibold text-gray-900">Pay Once</h4>
              <div className="text-3xl font-bold text-gray-900">£37</div>
            </div>
            <p className="text-gray-600 mb-4">Perfect for immediate access to your complete launch kit</p>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                Complete business case & strategy
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                30-day content strategy
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                Live website with 2 months free hosting
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                3 regenerations per section
              </li>
            </ul>
          </div>

          {/* Subscription Payment */}
          <div 
            className={`border-2 rounded-lg p-6 cursor-pointer transition-colors ${
              selectedPlan === 'subscription' 
                ? 'border-mint-500 bg-mint-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setSelectedPlan('subscription')}
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xl font-semibold text-gray-900">Daily Plan</h4>
              <div className="text-3xl font-bold text-gray-900">£1<span className="text-lg font-normal">/day</span></div>
            </div>
            <p className="text-gray-600 mb-4">Spread the cost over 37 days (£37 total)</p>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                Everything in Pay Once
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                Cancel anytime
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                Auto-ends after 37 days
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                Same £37 total
              </li>
            </ul>
          </div>
        </div>

        {/* Trust Elements */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <Shield className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-900 mb-1">Money-Back Guarantee</h4>
              <p className="text-sm text-gray-600">30-day refund if not satisfied</p>
            </div>
            <div>
              <Users className="h-8 w-8 text-mint-600 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-900 mb-1">500+ Kits Delivered</h4>
              <p className="text-sm text-gray-600">Join successful entrepreneurs</p>
            </div>
            <div>
              <Star className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-900 mb-1">4.9/5 Rating</h4>
              <p className="text-sm text-gray-600">From our community</p>
            </div>
          </div>
        </div>

        {/* Payment Button */}
        <div className="text-center">
          <Button
            onClick={handlePayment}
            disabled={isLoading}
            size="lg"
            className="px-12 py-4 text-lg"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Processing...
              </>
            ) : (
              <>
                {selectedPlan === 'oneoff' ? 'Get Kit (Bypass Payment)' : 'Get Kit (Bypass Payment)'}
              </>
            )}
          </Button>
          
          <p className="text-xs text-gray-500 mt-3">
            Payment bypassed for development • SSL encrypted
          </p>
        </div>
      </div>
    </div>
  );
}
