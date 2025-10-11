'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/Button';
import { Globe, CheckCircle, ExternalLink, Plus } from 'lucide-react';

interface Website {
  id: string;
  template_name: string;
  html_content: string;
  created_at: string;
}

interface WebsiteTabProps {
  kitId: string;
  isComplete: boolean;
  hasCheckoutAccess: boolean;
  onMarkComplete: () => void;
}

export function WebsiteTab({
  kitId,
  isComplete,
  onMarkComplete,
}: WebsiteTabProps) {
  const [websites, setWebsites] = useState<Website[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchWebsites = useCallback(async () => {
    try {
      const response = await fetch(`/api/kits/${kitId}/websites`);
      if (response.ok) {
        const data = await response.json();
        setWebsites(data.websites || []);
      }
    } catch (error) {
      console.error('Error fetching websites:', error);
    } finally {
      setIsLoading(false);
    }
  }, [kitId]);

  useEffect(() => {
    fetchWebsites();
  }, [fetchWebsites]);

  const handleCreateWebsite = () => {
    window.location.href = `/kit/${kitId}/website`;
  };

  const handleEditWebsite = (websiteId: string) => {
    window.location.href = `/kit/${kitId}/website/${websiteId}`;
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
            <Globe className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Website</h1>
            <p className="text-silver-400 mt-1">
              Create a professional website powered by your business strategy
            </p>
          </div>
        </div>

        {/* Status badge */}
        {isComplete && (
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-lg">
            <CheckCircle className="h-4 w-4 text-green-400" />
            <span className="text-sm font-medium text-green-400">Section Complete</span>
          </div>
        )}
      </div>

      {/* Info callout */}
      <div className="bg-gradient-to-r from-white/5 to-transparent border border-white/10 rounded-xl p-6 mb-8">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <Globe className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Website Generation - Unlimited
            </h3>
            <p className="text-silver-400 text-sm leading-relaxed">
              Create and customize as many website designs as you need. Choose from 8 professional templates, 
              then customize colors, text, and layout with our visual editor. Unlimited regenerations both 
              before and after checkout.
            </p>
          </div>
        </div>
      </div>

      {/* Content area */}
      {isLoading ? (
        <div className="bg-charcoal-900/50 border border-white/10 rounded-2xl p-12 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-silver-400">Loading your websites...</p>
        </div>
      ) : websites.length === 0 ? (
        // No websites yet - show create button
        <div className="bg-charcoal-900/50 border border-white/10 rounded-2xl p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Globe className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-4">
              Ready to Build Your Website?
            </h3>
            <p className="text-silver-400 mb-8">
              Choose from 8 professional templates and let AI populate it with content from your 
              business case. Then customize everything with our visual editor.
            </p>
            <Button
              onClick={handleCreateWebsite}
              size="lg"
              className="bg-white hover:bg-silver-100 text-black px-8"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create Website
            </Button>
            <p className="text-xs text-silver-600 mt-4">
              8 templates available • Unlimited customization • No coding required
            </p>
          </div>
        </div>
      ) : (
        // Websites exist - show list
        <div className="space-y-6">
          {/* Action buttons */}
          <div className="flex items-center justify-between bg-charcoal-900/50 border border-white/10 rounded-xl p-4">
            <div className="flex items-center gap-3">
              {!isComplete && websites.length > 0 && (
                <Button
                  onClick={onMarkComplete}
                  variant="default"
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark as Complete
                </Button>
              )}
            </div>
            
            <Button
              onClick={handleCreateWebsite}
              variant="outline"
              size="sm"
              className="border-white/10 text-silver-300 hover:bg-white/5"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Another
            </Button>
          </div>

          {/* Websites grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {websites.map((website) => (
              <div 
                key={website.id}
                className="bg-charcoal-900/50 border border-white/10 rounded-xl p-6 hover:border-white/20 transition-all group cursor-pointer"
                onClick={() => handleEditWebsite(website.id)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">
                      {website.template_name}
                    </h3>
                    <p className="text-sm text-silver-500">
                      Created {new Date(website.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center group-hover:bg-white/10 transition-colors">
                    <Globe className="h-5 w-5 text-white" />
                  </div>
                </div>

                {/* Preview */}
                <div className="aspect-video bg-charcoal-800 rounded-lg mb-4 overflow-hidden border border-white/5">
                  <iframe
                    srcDoc={website.html_content}
                    className="w-full h-full pointer-events-none"
                    title={`Preview of ${website.template_name}`}
                  />
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditWebsite(website.id);
                    }}
                    variant="outline"
                    size="sm"
                    className="flex-1 border-white/10 text-silver-300 hover:bg-white/5"
                  >
                    Edit & Customize
                  </Button>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(`/kit/${kitId}/website/${website.id}?preview=true`, '_blank');
                    }}
                    variant="outline"
                    size="sm"
                    className="border-white/10 text-silver-300 hover:bg-white/5"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Tip */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h4 className="text-sm font-semibold text-white mb-2">💡 Pro Tip</h4>
            <p className="text-sm text-silver-400">
              Create multiple versions and A/B test different designs. You have unlimited website 
              regenerations, so experiment until you find the perfect design.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

