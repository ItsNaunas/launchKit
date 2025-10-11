'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { useAuth } from '@/contexts/AuthContext';
import { Sparkles, ArrowLeft, Coins, AlertCircle } from 'lucide-react';

export default function NewDashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [credits, setCredits] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    one_liner: '',
    category: 'service' as const,
  });

  useEffect(() => {
    if (user) {
      fetchCredits();
    } else {
      router.push('/auth/signin');
    }
  }, [user, router]);

  const fetchCredits = async () => {
    if (!user) return;

    try {
      const response = await fetch(`/api/credits?userId=${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setCredits(data.balance);
        
        if (data.balance < 750) {
          setError('Insufficient credits. You need 750 credits to create a new dashboard.');
        }
      }
    } catch (error) {
      console.error('Error fetching credits:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (credits < 750) {
      setError('Insufficient credits');
      return;
    }

    if (!formData.title.trim()) {
      setError('Please enter a business title');
      return;
    }

    setIsCreating(true);
    setError('');

    try {
      const response = await fetch('/api/dashboards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          ...formData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create dashboard');
      }

      // Redirect to the new dashboard
      router.push(`/kit/${data.dashboard.id}/tabs`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsCreating(false);
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
                  <h1 className="text-2xl font-semibold text-white">Create New Dashboard</h1>
                  <p className="text-sm text-silver-400 mt-1">
                    Start a new launch kit for your business idea
                  </p>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-sm text-silver-500">Your Balance</div>
              <div className="text-lg font-bold text-white flex items-center gap-2">
                <Coins className="h-5 w-5 text-mint-400" />
                {credits} credits
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Cost notice */}
        <div className="bg-mint-500/10 border border-mint-500/20 rounded-xl p-6 mb-8">
          <div className="flex items-start gap-4">
            <Coins className="h-6 w-6 text-mint-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Creating This Dashboard Will Cost 750 Credits
              </h3>
              <p className="text-silver-400 text-sm">
                You currently have <span className="text-white font-semibold">{credits} credits</span>.
                {credits >= 750 ? (
                  <span className="text-green-400"> You have enough to proceed!</span>
                ) : (
                  <span className="text-red-400"> You need {750 - credits} more credits.</span>
                )}
              </p>
            </div>
          </div>
        </div>

        {credits < 750 && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 mb-8">
            <div className="flex items-start gap-4">
              <AlertCircle className="h-6 w-6 text-red-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Insufficient Credits
                </h3>
                <p className="text-silver-400 text-sm mb-4">
                  You need {750 - credits} more credits to create a new dashboard.
                </p>
                <Button
                  onClick={() => router.push('/credits')}
                  className="bg-mint-500 hover:bg-mint-400 text-black"
                >
                  Purchase Credits
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-charcoal-900/50 border border-white/10 rounded-2xl p-8">
            <h3 className="text-lg font-semibold text-white mb-6">
              Tell us about your new business idea
            </h3>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-silver-300 mb-2">
                  Business Title *
                </label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Premium Coffee Subscription Service"
                  className="bg-charcoal-800 border-white/10 text-white"
                  required
                />
                <p className="text-xs text-silver-500 mt-1">
                  This will be the name of your dashboard
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-silver-300 mb-2">
                  One-line Description
                </label>
                <Textarea
                  value={formData.one_liner}
                  onChange={(e) => setFormData({ ...formData, one_liner: e.target.value })}
                  placeholder="Describe your business in one sentence..."
                  rows={3}
                  className="bg-charcoal-800 border-white/10 text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-silver-300 mb-2">
                  Category
                </label>
                <Select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                  className="bg-charcoal-800 border-white/10 text-white"
                >
                  <option value="service">Service Business</option>
                  <option value="product">Physical Product</option>
                  <option value="local">Local Business</option>
                  <option value="content">Content/Creator</option>
                  <option value="e-com">E-commerce</option>
                  <option value="saas">SaaS/Software</option>
                </Select>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-between">
            <Button
              type="button"
              onClick={() => router.back()}
              variant="outline"
              className="border-white/10 text-silver-300"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isCreating || credits < 750}
              className="bg-mint-500 hover:bg-mint-400 text-black"
            >
              {isCreating ? (
                'Creating Dashboard...'
              ) : (
                <>
                  <Coins className="h-4 w-4 mr-2" />
                  Create Dashboard (750 credits)
                </>
              )}
            </Button>
          </div>
        </form>

        {/* Info */}
        <div className="mt-8 bg-charcoal-900/50 border border-white/10 rounded-xl p-6">
          <h4 className="text-sm font-semibold text-white mb-2">
            💡 What you'll get:
          </h4>
          <ul className="space-y-2 text-sm text-silver-400">
            <li className="flex items-start gap-2">
              <span className="text-mint-400">•</span>
              Complete business case and identity analysis
            </li>
            <li className="flex items-start gap-2">
              <span className="text-mint-400">•</span>
              30-day content strategy with viral hooks
            </li>
            <li className="flex items-start gap-2">
              <span className="text-mint-400">•</span>
              Professional website builder with templates
            </li>
            <li className="flex items-start gap-2">
              <span className="text-mint-400">•</span>
              Unlimited regenerations for all sections
            </li>
            <li className="flex items-start gap-2">
              <span className="text-mint-400">•</span>
              Locked to this idea to keep you focused
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

