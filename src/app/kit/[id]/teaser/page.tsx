'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { ArrowRight, FileText, Calendar, Globe, Lock } from 'lucide-react';
import { type KitData } from '@/lib/shared-types';

export default function TeaserPage({ params }: { params: Promise<{ id: string }> }) {
  const [kit, setKit] = useState<KitData | null>(null);
  const [kitId, setKitId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params;
      setKitId(resolvedParams.id);
    };
    
    resolveParams();
  }, [params]);

  useEffect(() => {
    if (!kitId) return;
    
    const fetchKit = async () => {
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

    fetchKit();
  }, [kitId]);

  const handleGenerateAnalysis = () => {
    // Redirect to preview page where AI generation will happen
    window.location.href = `/kit/${kitId}/preview`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold-500 mx-auto"></div>
          <p className="mt-2 text-silver-400 font-light">Loading your kit...</p>
        </div>
      </div>
    );
  }

  if (!kit) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-white">Kit not found</h1>
          <p className="text-silver-400 mt-2 font-light">The kit you&apos;re looking for doesn&apos;t exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Cinematic Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Subtle gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal-900/30 via-black to-black"></div>
        
        {/* Soft animated orbs - subtle and elegant */}
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-gold-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-silver-400/3 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        {/* Noise texture overlay - very subtle */}
        <div className="absolute inset-0 opacity-[0.02] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')]"></div>
      </div>
      {/* Header */}
      <div className="relative z-10 bg-gradient-to-br from-charcoal-800/40 to-charcoal-900/20 border-b border-white/10 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-semibold text-white mb-2 tracking-tight">{kit.title}</h1>
            <p className="text-silver-400 font-light">{kit.one_liner}</p>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-semibold text-white mb-4 tracking-tight">
            Your Personalized Launch Kit
          </h2>
          <p className="text-xl text-silver-400 font-light">
            Get AI-powered insights tailored specifically for your business idea
          </p>
        </div>

        {/* Blurred Placeholder Components */}
        <div className="space-y-8 mb-12">
          
          {/* Business Case Placeholder */}
          <div className="relative bg-gradient-to-br from-charcoal-800/40 to-charcoal-900/20 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-sm">
            <div className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <FileText className="h-7 w-7 text-gold-400" />
                <h3 className="text-xl font-semibold text-white">Business Case & Strategy</h3>
                <Lock className="h-5 w-5 text-silver-500" />
              </div>
              
              <div className="space-y-4">
                <div className="h-4 bg-silver-400/20 rounded w-3/4 blur-sm"></div>
                <div className="h-4 bg-silver-400/20 rounded w-1/2 blur-sm"></div>
                <div className="h-4 bg-silver-400/20 rounded w-2/3 blur-sm"></div>
                <div className="h-4 bg-silver-400/20 rounded w-1/3 blur-sm"></div>
              </div>
              
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/80 via-transparent to-transparent pointer-events-none"></div>
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
                <span className="bg-gold-500 text-black px-6 py-2 rounded-full text-sm font-medium">
                  Unlock Your Kit to View
                </span>
              </div>
            </div>
          </div>

          {/* Content Strategy Placeholder */}
          <div className="relative bg-gradient-to-br from-charcoal-800/40 to-charcoal-900/20 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-sm">
            <div className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <Calendar className="h-7 w-7 text-silver-300" />
                <h3 className="text-xl font-semibold text-white">Content Strategy</h3>
                <Lock className="h-5 w-5 text-silver-500" />
              </div>

              <div className="space-y-4">
                <div className="h-4 bg-silver-400/20 rounded w-4/5 blur-sm"></div>
                <div className="h-4 bg-silver-400/20 rounded w-3/5 blur-sm"></div>
                <div className="h-4 bg-silver-400/20 rounded w-2/3 blur-sm"></div>
                <div className="h-4 bg-silver-400/20 rounded w-1/2 blur-sm"></div>
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/80 via-transparent to-transparent pointer-events-none"></div>
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
                <span className="bg-silver-400 text-black px-6 py-2 rounded-full text-sm font-medium">
                  Unlock Your Kit to View
                </span>
              </div>
            </div>
          </div>

          {/* Website Preview Placeholder */}
          <div className="relative bg-gradient-to-br from-charcoal-800/40 to-charcoal-900/20 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-sm">
            <div className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <Globe className="h-7 w-7 text-white" />
                <h3 className="text-xl font-semibold text-white">Website Preview</h3>
                <Lock className="h-5 w-5 text-silver-500" />
              </div>
              
              <div className="space-y-4">
                <div className="h-4 bg-silver-400/20 rounded w-5/6 blur-sm"></div>
                <div className="h-4 bg-silver-400/20 rounded w-2/3 blur-sm"></div>
                <div className="h-4 bg-silver-400/20 rounded w-3/4 blur-sm"></div>
                <div className="h-4 bg-silver-400/20 rounded w-1/2 blur-sm"></div>
              </div>
              
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/80 via-transparent to-transparent pointer-events-none"></div>
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
                <span className="bg-white text-black px-6 py-2 rounded-full text-sm font-medium">
                  Unlock Your Kit to View
                </span>
              </div>
            </div>
          </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-br from-charcoal-800/40 to-charcoal-900/20 border border-white/10 rounded-3xl p-12 backdrop-blur-sm">
          <h3 className="text-3xl font-semibold text-white mb-4 tracking-tight">
            Ready to Unlock Your Kit?
          </h3>
          <p className="text-silver-400 mb-8 font-light">
            Click below to generate your personalized business case, content strategy, and website copy.
          </p>

          <Button
            onClick={handleGenerateAnalysis}
            size="lg"
            className="px-12 py-6 text-lg bg-white hover:bg-silver-100 text-black transition-all duration-300 font-medium"
          >
            Unlock My Kit
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
          
          <p className="text-sm text-silver-500 mt-6 font-light">
            Free during beta • AI-powered insights • Takes 30 seconds
          </p>
        </div>
      </div>
    </div>
  );
}