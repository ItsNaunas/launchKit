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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
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
            <p className="text-gray-600 mt-1">{kit.one_liner}</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Your Personalized Launch Kit
          </h2>
          <p className="text-lg text-gray-600">
            Get AI-powered insights tailored specifically for your business idea
          </p>
                </div>

        {/* Blurred Placeholder Components */}
        <div className="space-y-6 mb-8">
          
          {/* Business Case Placeholder */}
          <div className="relative bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="h-6 w-6 text-blue-600" />
                <h3 className="text-xl font-semibold text-gray-900">Business Case & Strategy</h3>
                <Lock className="h-5 w-5 text-gray-400" />
                </div>
              
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4 blur-sm"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 blur-sm"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 blur-sm"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3 blur-sm"></div>
              </div>
              
              <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent pointer-events-none"></div>
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                  Unlock Your Kit to View
                </span>
          </div>
        </div>
      </div>

          {/* Content Strategy Placeholder */}
          <div className="relative bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="h-6 w-6 text-green-600" />
                <h3 className="text-xl font-semibold text-gray-900">Content Strategy</h3>
                <Lock className="h-5 w-5 text-gray-400" />
        </div>

              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-4/5 blur-sm"></div>
                <div className="h-4 bg-gray-200 rounded w-3/5 blur-sm"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 blur-sm"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 blur-sm"></div>
            </div>

              <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent pointer-events-none"></div>
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-green-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                  Unlock Your Kit to View
                </span>
              </div>
              </div>
            </div>

          {/* Website Preview Placeholder */}
          <div className="relative bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Globe className="h-6 w-6 text-purple-600" />
                <h3 className="text-xl font-semibold text-gray-900">Website Preview</h3>
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-5/6 blur-sm"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 blur-sm"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 blur-sm"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 blur-sm"></div>
              </div>
              
                      <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent pointer-events-none"></div>
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                  Unlock Your Kit to View
                </span>
                  </div>
                </div>
              </div>
          </div>

        {/* CTA Section */}
        <div className="text-center bg-white rounded-lg shadow-sm p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Unlock Your Kit?
          </h3>
          <p className="text-gray-600 mb-6">
            Click below to generate your personalized business case, content strategy, and website copy.
          </p>

          <Button
            onClick={handleGenerateAnalysis}
            size="lg"
            className="px-8 py-4 text-lg flex items-center gap-2 mx-auto"
          >
            Unlock My Kit
            <ArrowRight className="h-5 w-5" />
          </Button>
          
          <p className="text-sm text-gray-500 mt-4">
            ✨ Free during beta • AI-powered insights • Takes 30 seconds
          </p>
        </div>
      </div>
    </div>
  );
}