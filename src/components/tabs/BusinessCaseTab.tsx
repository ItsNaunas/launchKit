'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Download, RefreshCw, FileText, TrendingUp, CheckCircle } from 'lucide-react';
import { type BusinessCaseContent } from '@/lib/shared-types';

interface BusinessCaseTabProps {
  kitId: string;
  output: {
    content: BusinessCaseContent;
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

export function BusinessCaseTab({
  kitId,
  output,
  isComplete,
  hasCheckoutAccess,
  onGenerate,
  onMarkComplete,
  onDownloadPDF,
}: BusinessCaseTabProps) {
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
          <div className="w-12 h-12 bg-mint-500/10 rounded-xl flex items-center justify-center">
            <TrendingUp className="h-6 w-6 text-mint-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Business Case & Identity</h1>
            <p className="text-silver-400 mt-1">
              Your market positioning, value proposition, and strategic foundation
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
            <div className="w-16 h-16 bg-mint-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <FileText className="h-8 w-8 text-mint-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-4">
              Ready to Generate Your Business Case?
            </h3>
            <p className="text-silver-400 mb-8">
              Our expert-backed AI will analyze your business idea and create a comprehensive strategic foundation 
              including positioning, value proposition, pricing strategy, and actionable next steps.
              <span className="block mt-2 text-mint-400 text-sm">
                ✓ Expert-backed • Optimized for maximum success
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
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Generate Business Case
                </>
              )}
            </Button>
            <p className="text-xs text-silver-600 mt-4">
              Takes 15-30 seconds • Uses AI to analyze your business idea
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
                  variant="primary"
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
            <BusinessCaseDisplay content={output.content} />
          </div>

          {/* Incomplete Next Steps Generator - Always Available */}
          <div className="bg-gradient-to-r from-green-500/10 to-transparent border border-green-500/20 rounded-xl p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                  <span className="w-1 h-6 bg-green-400 rounded-full"></span>
                  Need More Actionable Steps?
                </h4>
                <p className="text-silver-400 text-sm mb-4">
                  Happy with your business case but need additional next steps? Generate more actionable tasks 
                  to keep your momentum going.
                  <span className="block mt-1 text-green-400 text-xs">
                    ✓ Always available • Unlimited uses after checkout
                  </span>
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleGenerate(true)}
                disabled={isGenerating}
                className="border-green-500/20 text-green-400 hover:bg-green-500/10 whitespace-nowrap ml-4"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
                Generate More Steps
              </Button>
            </div>
          </div>

          {/* Upgrade prompt if needed */}
          {!hasCheckoutAccess && output.regens_remaining === 0 && (
            <div className="bg-gradient-to-r from-mint-500/10 to-mint-400/10 border border-mint-500/20 rounded-xl p-6 text-center">
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

// Component to display business case content
function BusinessCaseDisplay({ content }: { content: BusinessCaseContent }) {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
          <span className="w-1 h-6 bg-mint-400 rounded-full"></span>
          Positioning
        </h3>
        <p className="text-silver-300 leading-relaxed">{content.positioning}</p>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
          <span className="w-1 h-6 bg-mint-400 rounded-full"></span>
          Value Proposition
        </h3>
        <p className="text-silver-300 leading-relaxed">{content.value_prop}</p>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
          <span className="w-1 h-6 bg-mint-400 rounded-full"></span>
          Target Audience
        </h3>
        <p className="text-silver-300 leading-relaxed">{content.audience_summary}</p>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
          <span className="w-1 h-6 bg-mint-400 rounded-full"></span>
          Key Offer Points
        </h3>
        <ul className="space-y-3">
          {content.offer_bullets?.map((bullet: string, index: number) => (
            <li key={index} className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 bg-mint-400 rounded-full mt-2 flex-shrink-0"></span>
              <span className="text-silver-300">{bullet}</span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
          <span className="w-1 h-6 bg-mint-400 rounded-full"></span>
          Brand Identity
        </h3>
        <div className="space-y-2">
          <p className="text-silver-300">
            <span className="text-white font-medium">Vibe:</span> {content.brand_identity?.vibe}
          </p>
          <p className="text-silver-300">
            <span className="text-white font-medium">Keywords:</span> {content.brand_identity?.keywords?.join(', ')}
          </p>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
          <span className="w-1 h-6 bg-mint-400 rounded-full"></span>
          Pricing Strategy
        </h3>
        <p className="text-silver-300 mb-3">
          <span className="text-white font-medium">Recommendation:</span> {content.pricing?.idea}
        </p>
        <p className="text-white font-medium mb-2">Alternatives:</p>
        <ul className="space-y-2">
          {content.pricing?.alternatives?.map((alt: string, index: number) => (
            <li key={index} className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 bg-silver-400 rounded-full mt-2 flex-shrink-0"></span>
              <span className="text-silver-300">{alt}</span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
          <span className="w-1 h-6 bg-mint-400 rounded-full"></span>
          Business Name Ideas
        </h3>
        <div className="flex flex-wrap gap-2">
          {content.name_ideas?.map((name: string, index: number) => (
            <span key={index} className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-silver-300">
              {name}
            </span>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
          <span className="w-1 h-6 bg-mint-400 rounded-full"></span>
          Tagline Options
        </h3>
        <ul className="space-y-2">
          {content.taglines?.map((tagline: string, index: number) => (
            <li key={index} className="text-silver-300 italic">&quot;{tagline}&quot;</li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
          <span className="w-1 h-6 bg-mint-400 rounded-full"></span>
          Key Risks to Consider
        </h3>
        <ul className="space-y-3">
          {content.risks?.map((risk: string, index: number) => (
            <li key={index} className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2 flex-shrink-0"></span>
              <span className="text-silver-300">{risk}</span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
          <span className="w-1 h-6 bg-green-400 rounded-full"></span>
          Your First 3 Steps
        </h3>
        <ol className="space-y-4">
          {content.first_3_steps?.map((step: string, index: number) => (
            <li key={index} className="flex items-start gap-4">
              <span className="flex-shrink-0 w-8 h-8 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center text-green-400 font-semibold text-sm">
                {index + 1}
              </span>
              <span className="text-silver-300 pt-1">{step}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

