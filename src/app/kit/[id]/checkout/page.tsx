'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Sparkles, ShoppingCart, Check, Info, Globe } from 'lucide-react';

export default function CheckoutPage({ params }: { params: Promise<{ id: string }> }) {
  const [kitId, setKitId] = useState<string>('');
  const [kit, setKit] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'oneoff' | 'subscription'>('oneoff');
  const [includeHosting, setIncludeHosting] = useState(true); // Default to true for better conversion

  // Resolve params
  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params;
      setKitId(resolvedParams.id);
    };
    resolveParams();
  }, [params]);

  // Fetch kit data
  useEffect(() => {
    if (!kitId) return;
    
    const fetchKit = async () => {
      try {
        const response = await fetch(`/api/kits/${kitId}`);
        if (response.ok) {
          const data = await response.json();
          setKit(data);
        }
      } catch (error) {
        console.error('Error fetching kit:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchKit();
  }, [kitId]);

  const handleCheckout = async () => {
    setIsProcessing(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kitId,
          planType: selectedPlan,
          includeHosting,
        }),
      });

      if (!response.ok) {
        throw new Error('Checkout failed');
      }

      const { url } = await response.json();
      window.location.href = url; // Redirect to Stripe Checkout
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-silver-400">Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (!kit) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white">Kit not found</h1>
          <p className="text-silver-400 mt-2">The kit you&apos;re looking for doesn&apos;t exist.</p>
        </div>
      </div>
    );
  }

  // Pricing calculations (currently unused as payment is bypassed)
  // const oneoffTotal = includeHosting ? 37 + 3 * 2 : 37; // £37 + £6 for 2 months hosting
  // const subscriptionDailyRate = 1;
  // const subscriptionTotal = 37;

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-charcoal-900/50 border-b border-white/10 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <Sparkles className="h-6 w-6 text-mint-500" />
            <div>
              <h1 className="text-2xl font-semibold text-white">Complete Your Purchase</h1>
              <p className="text-sm text-silver-400 mt-1">{kit.title}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Trust banner */}
        <div className="bg-gradient-to-r from-mint-500/10 to-transparent border border-mint-500/20 rounded-xl p-6 mb-12">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-mint-500/20 rounded-full flex items-center justify-center flex-shrink-0">
              <Check className="h-6 w-6 text-mint-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">
                All 3 Sections Complete! 🎉
              </h3>
              <p className="text-silver-400 text-sm">
                Your complete launch kit is ready. Unlock full access now with no subscriptions and no hidden fees.
              </p>
            </div>
          </div>
        </div>

        {/* Pricing options */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-white mb-6">Choose Your Payment Option</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* One-off payment */}
            <button
              onClick={() => setSelectedPlan('oneoff')}
              className={`
                relative bg-charcoal-900/50 border rounded-2xl p-8 text-left transition-all
                ${selectedPlan === 'oneoff' 
                  ? 'border-mint-500/40 ring-2 ring-mint-500/20' 
                  : 'border-white/10 hover:border-white/20'
                }
              `}
            >
              {selectedPlan === 'oneoff' && (
                <div className="absolute top-4 right-4 w-6 h-6 bg-mint-500 rounded-full flex items-center justify-center">
                  <Check className="h-4 w-4 text-black" />
                </div>
              )}
              <h3 className="text-xl font-semibold text-white mb-2">Pay Once</h3>
              <div className="text-4xl font-bold text-white mb-4">
                £37
                <span className="text-base font-normal text-silver-400">/one-time</span>
              </div>
              <p className="text-silver-400 text-sm mb-6">
                Perfect for immediate access to your complete launch kit
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-sm text-silver-300">
                  <Check className="h-4 w-4 text-mint-400 flex-shrink-0" />
                  Complete business case & strategy
                </li>
                <li className="flex items-center gap-2 text-sm text-silver-300">
                  <Check className="h-4 w-4 text-mint-400 flex-shrink-0" />
                  30-day content strategy
                </li>
                <li className="flex items-center gap-2 text-sm text-silver-300">
                  <Check className="h-4 w-4 text-mint-400 flex-shrink-0" />
                  Professional website builder
                </li>
                <li className="flex items-center gap-2 text-sm text-silver-300">
                  <Check className="h-4 w-4 text-mint-400 flex-shrink-0" />
                  Unlimited regenerations
                </li>
              </ul>
            </button>

            {/* Subscription payment */}
            <button
              onClick={() => setSelectedPlan('subscription')}
              className={`
                relative bg-charcoal-900/50 border rounded-2xl p-8 text-left transition-all
                ${selectedPlan === 'subscription' 
                  ? 'border-mint-500/40 ring-2 ring-mint-500/20' 
                  : 'border-white/10 hover:border-white/20'
                }
              `}
            >
              {selectedPlan === 'subscription' && (
                <div className="absolute top-4 right-4 w-6 h-6 bg-mint-500 rounded-full flex items-center justify-center">
                  <Check className="h-4 w-4 text-black" />
                </div>
              )}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-gradient-to-r from-mint-500 to-mint-400 text-black px-4 py-1 rounded-full text-xs font-semibold shadow-lg">
                  FLEXIBLE
                </span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Daily Plan</h3>
              <div className="text-4xl font-bold text-white mb-4">
                £1
                <span className="text-base font-normal text-silver-400">/day × 37</span>
              </div>
              <p className="text-silver-400 text-sm mb-6">
                Spread the cost over time, same great value
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-sm text-silver-300">
                  <Check className="h-4 w-4 text-mint-400 flex-shrink-0" />
                  Everything in Pay Once
                </li>
                <li className="flex items-center gap-2 text-sm text-silver-300">
                  <Check className="h-4 w-4 text-mint-400 flex-shrink-0" />
                  Cancel anytime
                </li>
                <li className="flex items-center gap-2 text-sm text-silver-300">
                  <Check className="h-4 w-4 text-mint-400 flex-shrink-0" />
                  Auto-ends after 37 days
                </li>
                <li className="flex items-center gap-2 text-sm text-silver-300">
                  <Check className="h-4 w-4 text-mint-400 flex-shrink-0" />
                  Same £37 total
                </li>
              </ul>
            </button>
          </div>
        </div>

        {/* Hosting add-on */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-white mb-6">Website Hosting (Optional)</h2>
          <button
            onClick={() => setIncludeHosting(!includeHosting)}
            className={`
              w-full bg-charcoal-900/50 border rounded-2xl p-8 text-left transition-all
              ${includeHosting 
                ? 'border-green-500/40 ring-2 ring-green-500/20' 
                : 'border-white/10 hover:border-white/20'
              }
            `}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                    <Globe className="h-5 w-5 text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Professional Website Hosting</h3>
                    <p className="text-sm text-silver-400">Deploy your website with just one click</p>
                  </div>
                </div>
                
                <div className="ml-13 space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm text-silver-300">
                    <Check className="h-4 w-4 text-green-400 flex-shrink-0" />
                    Lightning-fast global CDN
                  </div>
                  <div className="flex items-center gap-2 text-sm text-silver-300">
                    <Check className="h-4 w-4 text-green-400 flex-shrink-0" />
                    Free SSL certificate & custom domain
                  </div>
                  <div className="flex items-center gap-2 text-sm text-silver-300">
                    <Check className="h-4 w-4 text-green-400 flex-shrink-0" />
                    Automatic updates & backups
                  </div>
                  <div className="flex items-center gap-2 text-sm text-green-400 font-semibold">
                    <Check className="h-4 w-4 flex-shrink-0" />
                    First 2 months FREE (£6 value)
                  </div>
                </div>

                <div className="ml-13 bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-semibold">£3/month</p>
                      <p className="text-xs text-silver-500">First 2 months free, then £3/month</p>
                    </div>
                    <div className="text-right">
                      <p className="text-silver-400 line-through text-sm">£6</p>
                      <p className="text-green-400 font-semibold">FREE today</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className={`
                w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ml-4
                ${includeHosting 
                  ? 'bg-green-500 border-green-500' 
                  : 'border-white/30'
                }
              `}>
                {includeHosting && <Check className="h-4 w-4 text-black" />}
              </div>
            </div>
          </button>

          {/* Info callout */}
          <div className="mt-4 flex items-start gap-3 text-sm text-silver-400 bg-white/5 rounded-lg p-4 border border-white/10">
            <Info className="h-5 w-5 text-silver-500 flex-shrink-0 mt-0.5" />
            <p>
              You can always host your website yourself by downloading the files. This option provides 
              hassle-free hosting with premium features. Cancel anytime.
            </p>
          </div>
        </div>

        {/* Order summary */}
        <div className="bg-charcoal-900/50 border border-white/10 rounded-2xl p-8 mb-8">
          <h3 className="text-lg font-semibold text-white mb-6">Order Summary</h3>
          
          <div className="space-y-4 mb-6">
            <div className="flex justify-between text-silver-300">
              <span>LaunchKit AI - Full Access</span>
              <span>£37.00</span>
            </div>
            
            {includeHosting && selectedPlan === 'oneoff' && (
              <>
                <div className="flex justify-between text-silver-300">
                  <span>Website Hosting (2 months free)</span>
                  <span className="line-through">£6.00</span>
                </div>
                <div className="flex justify-between text-green-400 text-sm">
                  <span>First 2 months free discount</span>
                  <span>-£6.00</span>
                </div>
              </>
            )}
            
            <div className="border-t border-white/10 pt-4">
              <div className="flex justify-between text-xl font-semibold text-white">
                <span>Total Due Today</span>
                <span>£{selectedPlan === 'oneoff' ? '37.00' : subscriptionDailyRate.toFixed(2)}</span>
              </div>
              {selectedPlan === 'subscription' && (
                <p className="text-xs text-silver-500 mt-2 text-right">
                  Then £{subscriptionDailyRate}/day for 36 more days
                </p>
              )}
              {includeHosting && selectedPlan === 'oneoff' && (
                <p className="text-xs text-silver-500 mt-2 text-right">
                  Then £3/month for hosting after 2 months
                </p>
              )}
            </div>
          </div>

          <Button
            onClick={handleCheckout}
            disabled={isProcessing}
            className="w-full bg-white hover:bg-silver-100 text-black"
            size="lg"
          >
            {isProcessing ? (
              <>Processing...</>
            ) : (
              <>
                <ShoppingCart className="h-5 w-5 mr-2" />
                Complete Purchase - £{selectedPlan === 'oneoff' ? '37.00' : subscriptionDailyRate.toFixed(2)}
              </>
            )}
          </Button>

          {/* Trust badges */}
          <div className="flex items-center justify-center gap-6 mt-6 pt-6 border-t border-white/10">
            <div className="text-center">
              <Check className="h-5 w-5 text-green-400 mx-auto mb-1" />
              <p className="text-xs text-silver-500">Secure Payment</p>
            </div>
            <div className="text-center">
              <Check className="h-5 w-5 text-green-400 mx-auto mb-1" />
              <p className="text-xs text-silver-500">No Hidden Fees</p>
            </div>
            <div className="text-center">
              <Check className="h-5 w-5 text-green-400 mx-auto mb-1" />
              <p className="text-xs text-silver-500">Instant Access</p>
            </div>
          </div>
        </div>

        {/* Money-back guarantee */}
        <div className="text-center">
          <p className="text-sm text-silver-400">
            🛡️ 7-day money-back guarantee • If you&apos;re not satisfied, we&apos;ll refund you in full
          </p>
        </div>
      </div>
    </div>
  );
}

