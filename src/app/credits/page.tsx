'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';
import { Sparkles, Zap, Check, ArrowLeft } from 'lucide-react';

export default function CreditsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [balance, setBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isPurchasing, setIsPurchasing] = useState(false);

  const fetchBalance = useCallback(async () => {
    if (!user) return;
    
    try {
      const response = await fetch(`/api/credits?userId=${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setBalance(data.balance);
      }
    } catch (error) {
      console.error('Error fetching credits:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchBalance();
    } else {
      setIsLoading(false);
    }
  }, [user, fetchBalance]);

  const handlePurchase = async (packageType: '500' | '1000') => {
    if (!user) {
      router.push('/auth/signin');
      return;
    }

    setIsPurchasing(true);
    try {
      const response = await fetch('/api/credits/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          package: packageType,
        }),
      });

      if (!response.ok) {
        throw new Error('Purchase failed');
      }

      const { url } = await response.json();
      window.location.href = url; // Redirect to Stripe Checkout
    } catch (error) {
      console.error('Purchase error:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsPurchasing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-silver-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-charcoal-900/50 border-b border-white/10 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="text-silver-400 hover:text-white"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div className="flex items-center gap-3">
                <Sparkles className="h-6 w-6 text-mint-500" />
                <div>
                  <h1 className="text-2xl font-semibold text-white">Purchase Credits</h1>
                  <p className="text-sm text-silver-400 mt-1">
                    Create multiple dashboards for new ideas
                  </p>
                </div>
              </div>
            </div>
            
            {user && (
              <div className="text-right">
                <div className="text-sm text-silver-500">Your Balance</div>
                <div className="text-2xl font-bold text-white">{balance} credits</div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Info banner */}
        <div className="bg-gradient-to-r from-mint-500/10 to-transparent border border-mint-500/20 rounded-xl p-6 mb-12">
          <h3 className="text-lg font-semibold text-white mb-2">
            What are Credits?
          </h3>
          <p className="text-silver-400 text-sm">
            Credits allow you to create additional dashboards for new business ideas. 
            Each new dashboard costs <span className="text-white font-semibold">750 credits</span> and includes 
            a complete launch kit with business case, content strategy, and website builder.
            <span className="block mt-2 text-mint-400">
              💡 Focus over idea-hopping – each dashboard is locked to its business idea to keep you focused.
            </span>
          </p>
        </div>

        {/* Credit packages */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 500 Credits Package */}
          <div className="bg-charcoal-900/50 border border-white/10 rounded-2xl p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-silver-400/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-silver-300" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-2">Starter Pack</h3>
              <div className="text-5xl font-bold text-white mb-2">
                500
                <span className="text-lg font-normal text-silver-400"> credits</span>
              </div>
              <div className="text-3xl font-semibold text-mint-400 mb-4">£6.99</div>
              <p className="text-silver-400 text-sm">
                Perfect for testing a new idea
              </p>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-2 text-sm text-silver-300">
                <Check className="h-4 w-4 text-mint-400 flex-shrink-0" />
                500 credits (enough for 0.66 dashboards)
              </li>
              <li className="flex items-center gap-2 text-sm text-silver-300">
                <Check className="h-4 w-4 text-mint-400 flex-shrink-0" />
                Never expires
              </li>
              <li className="flex items-center gap-2 text-sm text-silver-300">
                <Check className="h-4 w-4 text-mint-400 flex-shrink-0" />
                Instant delivery
              </li>
            </ul>

            <Button
              onClick={() => handlePurchase('500')}
              disabled={isPurchasing || !user}
              className="w-full bg-white hover:bg-silver-100 text-black"
              size="lg"
            >
              {!user ? 'Sign In to Purchase' : (isPurchasing ? 'Processing...' : 'Purchase 500 Credits')}
            </Button>

            <p className="text-center text-xs text-silver-500 mt-4">
              Best for: 1 new dashboard (250 credits left over)
            </p>
          </div>

          {/* 1000 Credits Package */}
          <div className="bg-charcoal-900/50 border border-mint-500/40 rounded-2xl p-8 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="bg-gradient-to-r from-mint-500 to-mint-400 text-black px-4 py-1 rounded-full text-xs font-semibold shadow-lg">
                BEST VALUE
              </span>
            </div>

            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-mint-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-8 w-8 text-mint-400" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-2">Pro Pack</h3>
              <div className="text-5xl font-bold text-white mb-2">
                1000
                <span className="text-lg font-normal text-silver-400"> credits</span>
              </div>
              <div className="text-3xl font-semibold text-mint-400 mb-1">£12.99</div>
              <div className="text-sm text-green-400 mb-4">
                Save £0.50 per dashboard
              </div>
              <p className="text-silver-400 text-sm">
                Perfect for exploring multiple ideas
              </p>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-2 text-sm text-silver-300">
                <Check className="h-4 w-4 text-mint-400 flex-shrink-0" />
                1000 credits (enough for 1.33 dashboards)
              </li>
              <li className="flex items-center gap-2 text-sm text-silver-300">
                <Check className="h-4 w-4 text-mint-400 flex-shrink-0" />
                Never expires
              </li>
              <li className="flex items-center gap-2 text-sm text-silver-300">
                <Check className="h-4 w-4 text-mint-400 flex-shrink-0" />
                Instant delivery
              </li>
              <li className="flex items-center gap-2 text-sm text-green-400 font-semibold">
                <Check className="h-4 w-4 flex-shrink-0" />
                Best value per credit
              </li>
            </ul>

            <Button
              onClick={() => handlePurchase('1000')}
              disabled={isPurchasing || !user}
              className="w-full bg-mint-500 hover:bg-mint-400 text-black"
              size="lg"
            >
              {!user ? 'Sign In to Purchase' : (isPurchasing ? 'Processing...' : 'Purchase 1000 Credits')}
            </Button>

            <p className="text-center text-xs text-silver-500 mt-4">
              Best for: 1 new dashboard (250 credits left over for future)
            </p>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-16 bg-charcoal-900/50 border border-white/10 rounded-2xl p-8">
          <h3 className="text-xl font-semibold text-white mb-6">Frequently Asked Questions</h3>
          
          <div className="space-y-6">
            <div>
              <h4 className="text-white font-semibold mb-2">How much does a new dashboard cost?</h4>
              <p className="text-silver-400 text-sm">
                Each new dashboard costs 750 credits and includes a complete launch kit: business case, 
                content strategy, and website builder with unlimited regenerations.
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-2">Do credits expire?</h4>
              <p className="text-silver-400 text-sm">
                No! Your credits never expire. Purchase them once and use them whenever you&apos;re ready.
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-2">Can I refund unused credits?</h4>
              <p className="text-silver-400 text-sm">
                Credits are non-refundable, but you can use them at any time to create new dashboards. 
                They never expire, so there&apos;s no rush.
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-2">Why are dashboards locked to one idea?</h4>
              <p className="text-silver-400 text-sm">
                Focus over idea-hopping! We&apos;ve found that entrepreneurs succeed when they commit to one 
                idea and execute it fully. Each dashboard is locked to keep you focused on launching.
              </p>
            </div>
          </div>
        </div>

        {/* Back to dashboard */}
        {!user && (
          <div className="mt-8 text-center">
            <p className="text-silver-400 mb-4">
              Need to sign in to purchase credits
            </p>
            <Button
              onClick={() => router.push('/auth/signin')}
              variant="outline"
              className="border-white/10 text-silver-300"
            >
              Sign In
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

