'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';
import { Sparkles, Plus, TrendingUp, Calendar, Globe, Coins, ArrowRight, Lock } from 'lucide-react';

interface Dashboard {
  id: string;
  title: string;
  one_liner: string;
  created_at: string;
  has_access: boolean;
  checkout_completed_at: string | null;
}

export default function DashboardsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);
  const [credits, setCredits] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!user) return;

    try {
      // Fetch dashboards
      const dashboardsResponse = await fetch(`/api/dashboards?userId=${user.id}`);
      if (dashboardsResponse.ok) {
        const data = await dashboardsResponse.json();
        setDashboards(data.dashboards);
      }

      // Fetch credits
      const creditsResponse = await fetch(`/api/credits?userId=${user.id}`);
      if (creditsResponse.ok) {
        const data = await creditsResponse.json();
        setCredits(data.balance);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchData();
    } else {
      router.push('/auth/signin');
    }
  }, [user, router, fetchData]);

  const handleCreateNew = () => {
    if (credits < 750) {
      router.push('/credits');
    } else {
      router.push('/dashboard/new');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-silver-400">Loading your dashboards...</p>
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
            <div className="flex items-center gap-3">
              <Sparkles className="h-6 w-6 text-mint-500" />
              <div>
                <h1 className="text-2xl font-semibold text-white">My Dashboards</h1>
                <p className="text-sm text-silver-400 mt-1">
                  Manage your launch kits and business ideas
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-silver-500">Credits</div>
                <div className="text-lg font-bold text-white flex items-center gap-2">
                  <Coins className="h-5 w-5 text-mint-400" />
                  {credits}
                </div>
              </div>
              <Button
                onClick={() => router.push('/credits')}
                variant="outline"
                className="border-mint-500/40 text-mint-400 hover:bg-mint-500/10"
              >
                <Plus className="h-4 w-4 mr-2" />
                Buy Credits
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Create new dashboard card */}
        <div className="mb-12">
          <button
            onClick={handleCreateNew}
            className="w-full bg-gradient-to-br from-mint-500/10 to-transparent border-2 border-dashed border-mint-500/30 hover:border-mint-500/50 rounded-2xl p-12 transition-all group"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-mint-500/10 rounded-2xl flex items-center justify-center mb-6">
                <Plus className="h-10 w-10 text-mint-400" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-2">
                Create New Dashboard
              </h3>
              <p className="text-silver-400 mb-4 max-w-md">
                Start a new launch kit for a different business idea. Each dashboard includes full access 
                to business case, content strategy, and website builder.
              </p>
              <div className="flex items-center gap-2 text-mint-400 font-semibold">
                <Coins className="h-5 w-5" />
                <span>Costs 750 credits</span>
                {credits < 750 && (
                  <span className="text-silver-500 text-sm">
                    ({750 - credits} more needed)
                  </span>
                )}
              </div>
            </div>
          </button>
        </div>

        {/* Existing dashboards */}
        {dashboards.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-charcoal-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Sparkles className="h-8 w-8 text-silver-500" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No Dashboards Yet</h3>
            <p className="text-silver-400 max-w-md mx-auto mb-8">
              Get started by creating your first launch kit from the homepage, 
              or purchase credits to create additional dashboards.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button
                onClick={() => router.push('/')}
                className="bg-white hover:bg-silver-100 text-black"
              >
                Go to Homepage
              </Button>
              <Button
                onClick={() => router.push('/credits')}
                variant="outline"
                className="border-white/10 text-silver-300"
              >
                Buy Credits
              </Button>
            </div>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-semibold text-white mb-6">
              Your Launch Kits ({dashboards.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dashboards.map((dashboard) => (
                <div
                  key={dashboard.id}
                  className="bg-charcoal-900/50 border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all cursor-pointer group"
                  onClick={() => router.push(`/kit/${dashboard.id}/tabs`)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-mint-500/10 rounded-xl flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-mint-400" />
                    </div>
                    {dashboard.has_access ? (
                      <span className="text-xs px-3 py-1 bg-green-500/10 text-green-400 rounded-full border border-green-500/20">
                        Active
                      </span>
                    ) : (
                      <span className="text-xs px-3 py-1 bg-charcoal-800 text-silver-500 rounded-full border border-white/10">
                        <Lock className="h-3 w-3 inline mr-1" />
                        Locked
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-mint-400 transition-colors">
                    {dashboard.title}
                  </h3>
                  <p className="text-sm text-silver-400 mb-4 line-clamp-2">
                    {dashboard.one_liner}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-silver-500 mb-4">
                    <span>Created {new Date(dashboard.created_at).toLocaleDateString()}</span>
                  </div>

                  <div className="flex items-center gap-2 pt-4 border-t border-white/5">
                    <div className="flex items-center gap-2 text-xs text-silver-500">
                      <TrendingUp className="h-3 w-3" />
                      <Calendar className="h-3 w-3" />
                      <Globe className="h-3 w-3" />
                    </div>
                    <div className="ml-auto">
                      <ArrowRight className="h-4 w-4 text-silver-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Info section */}
        <div className="mt-16 bg-charcoal-900/50 border border-white/10 rounded-2xl p-8">
          <h3 className="text-lg font-semibold text-white mb-4">
            💡 Focus Over Idea-Hopping
          </h3>
          <p className="text-silver-400 text-sm leading-relaxed">
            Each dashboard is locked to its business idea to keep you focused on execution. 
            We&apos;ve found that entrepreneurs succeed when they commit to one idea and execute 
            it fully, rather than constantly switching between ideas. Create multiple dashboards 
            only when you&apos;re ready to seriously pursue a new venture.
          </p>
        </div>
      </div>
    </div>
  );
}

