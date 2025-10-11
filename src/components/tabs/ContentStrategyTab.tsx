'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Download, RefreshCw, Calendar, Users, CheckCircle } from 'lucide-react';
import { type ContentStrategyContent } from '@/lib/shared-types';

interface ContentStrategyTabProps {
  kitId: string;
  output: {
    content: ContentStrategyContent;
    regen_count: number;
    regens_remaining: number;
  } | null;
  isComplete: boolean;
  isLoading: boolean;
  hasCheckoutAccess: boolean;
  onGenerate: (regenerate: boolean) => Promise<void>;
  onMarkComplete: () => void;
  onDownloadPDF: () => void;
}

export function ContentStrategyTab({
  kitId,
  output,
  isComplete,
  isLoading,
  hasCheckoutAccess,
  onGenerate,
  onMarkComplete,
  onDownloadPDF,
}: ContentStrategyTabProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async (regenerate: boolean) => {
    setIsGenerating(true);
    try {
      await onGenerate(regenerate);
    } finally {
      setIsGenerating(false);
    }
  };

  // Check regeneration limits
  const canRegenerate = hasCheckoutAccess 
    ? true // Unlimited after checkout
    : (output?.regens_remaining ?? 1) > 0; // 1 regen pre-checkout

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-silver-400/10 rounded-xl flex items-center justify-center">
            <Calendar className="h-6 w-6 text-silver-300" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Content Strategy</h1>
            <p className="text-silver-400 mt-1">
              Your 30-day content calendar, viral hooks, and channel optimization
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

      {/* Content area */}
      {!output ? (
        // No output yet - show generate button
        <div className="bg-charcoal-900/50 border border-white/10 rounded-2xl p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-silver-400/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Calendar className="h-8 w-8 text-silver-300" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-4">
              Ready to Generate Your Content Strategy?
            </h3>
            <p className="text-silver-400 mb-8">
              Get a complete 30-day content calendar with viral hooks, channel-specific optimization, 
              and proven templates tailored to your audience.
              <span className="block mt-2 text-mint-400 text-sm">
                ✓ Expert-backed • Battle-tested strategies • No guesswork
              </span>
            </p>
            <Button
              onClick={() => handleGenerate(false)}
              disabled={isGenerating}
              size="lg"
              className="bg-white hover:bg-silver-100 text-black px-8"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Calendar className="h-5 w-5 mr-2" />
                  Generate Content Strategy
                </>
              )}
            </Button>
            <p className="text-xs text-silver-600 mt-4">
              Takes 15-30 seconds • Customized for your business and audience
            </p>
          </div>
        </div>
      ) : (
        // Output exists - show content and actions
        <div className="space-y-6">
          {/* Action buttons */}
          <div className="flex items-center justify-between bg-charcoal-900/50 border border-white/10 rounded-xl p-4">
            <div className="flex items-center gap-3">
              {!isComplete && (
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
              <Button
                variant="outline"
                size="sm"
                onClick={onDownloadPDF}
                className="border-white/10 text-silver-300 hover:bg-white/5"
              >
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            </div>
            
            <div className="flex items-center gap-3">
              {!hasCheckoutAccess && (
                <span className="text-xs text-silver-500">
                  {output.regens_remaining} regeneration{output.regens_remaining !== 1 ? 's' : ''} remaining
                </span>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleGenerate(true)}
                disabled={isGenerating || !canRegenerate}
                className="border-white/10 text-silver-300 hover:bg-white/5"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
                Regenerate
              </Button>
            </div>
          </div>

          {/* Content display */}
          <div className="bg-charcoal-900/50 border border-white/10 rounded-2xl p-8">
            <ContentStrategyDisplay content={output.content} />
          </div>

          {/* Upgrade prompt if needed */}
          {!hasCheckoutAccess && output.regens_remaining === 0 && (
            <div className="bg-gradient-to-r from-silver-400/10 to-silver-300/10 border border-silver-400/20 rounded-xl p-6 text-center">
              <h4 className="text-lg font-semibold text-white mb-2">
                Need More Regenerations?
              </h4>
              <p className="text-silver-400 mb-4">
                Unlock unlimited regenerations and access to all features for just £37
              </p>
              <Button
                onClick={() => window.location.href = `/kit/${kitId}/checkout`}
                className="bg-white hover:bg-silver-100 text-black"
              >
                Unlock Full Access
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Component to display content strategy
function ContentStrategyDisplay({ content }: { content: ContentStrategyContent }) {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <span className="w-1 h-6 bg-silver-400 rounded-full"></span>
          Primary Channels
        </h3>
        <div className="flex flex-wrap gap-3">
          {content.channels?.map((channel: string, index: number) => (
            <span 
              key={index} 
              className="px-4 py-2 bg-silver-400/10 border border-silver-400/20 rounded-lg text-silver-200 font-medium"
            >
              {channel}
            </span>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <span className="w-1 h-6 bg-silver-400 rounded-full"></span>
          Posting Schedule
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(content.cadence || {}).map(([channel, frequency]) => (
            <div 
              key={channel} 
              className="flex justify-between items-center p-4 bg-white/5 border border-white/10 rounded-lg"
            >
              <span className="text-silver-300 font-medium">{channel}</span>
              <span className="text-white font-semibold">{frequency as string}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <span className="w-1 h-6 bg-silver-400 rounded-full"></span>
          Content Tone & Voice
        </h3>
        <p className="text-silver-300 leading-relaxed">{content.tone}</p>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <span className="w-1 h-6 bg-silver-400 rounded-full"></span>
          Hook Templates (7 Proven Formats)
        </h3>
        <div className="space-y-4">
          {content.hooks_7?.map((hook: string, index: number) => (
            <div 
              key={index} 
              className="p-4 bg-white/5 border border-white/10 rounded-lg"
            >
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-8 h-8 bg-silver-400/10 border border-silver-400/20 rounded-full flex items-center justify-center text-silver-300 font-semibold text-sm">
                  {index + 1}
                </span>
                <p className="text-silver-300 pt-1">{hook}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <span className="w-1 h-6 bg-green-400 rounded-full"></span>
          30-Day Content Themes
        </h3>
        <div className="space-y-4">
          {content.thirty_day_themes?.map((theme: string, index: number) => (
            <div 
              key={index} 
              className="p-5 bg-gradient-to-r from-green-500/5 to-transparent border border-green-500/10 rounded-lg"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="text-sm font-semibold text-green-400 mb-1">Week {index + 1}</div>
                  <div className="text-xs text-silver-500">Days {index * 7 + 1}-{(index + 1) * 7}</div>
                </div>
                <p className="text-silver-300 leading-relaxed">
                  {theme.replace(/^Week \d+:\s*/, '')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

