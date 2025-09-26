'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Check, Sparkles, FileText, Calendar, Globe, Download, RefreshCw } from 'lucide-react';

interface KitData {
  id: string;
  title: string;
  one_liner: string;
  has_access: boolean;
}

interface BusinessCaseContent {
  positioning: string;
  value_prop: string;
  audience_summary: string;
  offer_bullets: string[];
  brand_identity: {
    vibe: string;
    keywords: string[];
  };
  pricing: {
    idea: string;
    alternatives: string[];
  };
  name_ideas: string[];
  taglines: string[];
  risks: string[];
  first_3_steps: string[];
}

interface ContentStrategyContent {
  channels: string[];
  cadence: Record<string, string>;
  tone: string;
  hooks_7: string[];
  thirty_day_themes: string[];
}

interface OutputData {
  business_case?: {
    id: string;
    content: BusinessCaseContent;
    regen_count: number;
    regens_remaining: number;
    created_at: string;
    updated_at: string;
  };
  content_strategy?: {
    id: string;
    content: ContentStrategyContent;
    regen_count: number;
    regens_remaining: number;
    created_at: string;
    updated_at: string;
  };
}

export default function KitPreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const [kit, setKit] = useState<KitData | null>(null);
  const [outputs, setOutputs] = useState<OutputData>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [kitId, setKitId] = useState<string>('');

  // Resolve params
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

        // Trigger AI generation for all content types
        setIsGenerating(true);
        await generateAllContent();
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
        setIsGenerating(false);
      }
    };

    fetchData();
  }, [kitId]);

  const generateAllContent = async () => {
    try {
      // Generate business case
      const businessCaseResponse = await fetch(`/api/kits/${kitId}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type: 'business_case' }),
      });

      if (businessCaseResponse.ok) {
        const businessCaseData = await businessCaseResponse.json();
        setOutputs(prev => ({
          ...prev,
          business_case: {
            id: `temp-${Date.now()}`,
            content: businessCaseData.content,
            regen_count: 0,
            regens_remaining: 3,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        }));
      }

      // Generate content strategy
      const contentStrategyResponse = await fetch(`/api/kits/${kitId}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type: 'content_strategy' }),
      });

      if (contentStrategyResponse.ok) {
        const contentStrategyData = await contentStrategyResponse.json();
        setOutputs(prev => ({
          ...prev,
          content_strategy: {
            id: `temp-${Date.now()}`,
            content: contentStrategyData.content,
            regen_count: 0,
            regens_remaining: 3,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        }));
      }
    } catch (error) {
      console.error('Error generating content:', error);
    }
  };

  const handleContinueToDashboard = () => {
    window.location.href = `/kit/${kitId}/dashboard`;
  };

  if (isLoading || isGenerating) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">
            {isGenerating ? 'Generating your analysis...' : 'Loading your kit...'}
          </p>
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{kit.title}</h1>
              <p className="text-gray-600 mt-1">{kit.one_liner}</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">LaunchKit AI</div>
              <div className="text-lg font-semibold text-green-600">✓ Analysis Complete</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Business Case Section */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <FileText className="h-6 w-6 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">Business Case & Strategy</h2>
              </div>
            </div>

            <div className="p-6">
              {outputs.business_case ? (
                <BusinessCaseDisplay content={outputs.business_case.content} />
              ) : (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Generating your business case...</p>
                </div>
              )}
            </div>
          </div>

          {/* Content Strategy Section */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <Calendar className="h-6 w-6 text-green-600" />
                <h2 className="text-xl font-semibold text-gray-900">Content Strategy</h2>
              </div>
            </div>

            <div className="p-6">
              {outputs.content_strategy ? (
                <ContentStrategyDisplay content={outputs.content_strategy.content} />
              ) : (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Generating your content strategy...</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Payment Placeholder */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              🚧 Payment Integration Coming Soon
            </h3>
            <p className="text-gray-600 mb-4">
              For now, enjoy free access to your complete launch kit. 
              Payment processing will be added soon.
            </p>
            <Button
              onClick={handleContinueToDashboard}
              size="lg"
              className="px-8 py-3"
            >
              Continue to Dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Component to display business case content
function BusinessCaseDisplay({ content }: { content: BusinessCaseContent }) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold text-gray-900 mb-2">Positioning</h3>
        <p className="text-gray-700 text-sm">{content.positioning}</p>
      </div>
      
      <div>
        <h3 className="font-semibold text-gray-900 mb-2">Value Proposition</h3>
        <p className="text-gray-700 text-sm">{content.value_prop}</p>
      </div>

      <div>
        <h3 className="font-semibold text-gray-900 mb-2">Target Audience</h3>
        <p className="text-gray-700 text-sm">{content.audience_summary}</p>
      </div>

      <div>
        <h3 className="font-semibold text-gray-900 mb-2">Key Benefits</h3>
        <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
          {content.offer_bullets?.slice(0, 3).map((bullet: string, index: number) => (
            <li key={index}>{bullet}</li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="font-semibold text-gray-900 mb-2">Next Steps</h3>
        <ol className="list-decimal list-inside space-y-1 text-gray-700 text-sm">
          {content.first_3_steps?.slice(0, 3).map((step: string, index: number) => (
            <li key={index}>{step}</li>
          ))}
        </ol>
      </div>
    </div>
  );
}

// Component to display content strategy
function ContentStrategyDisplay({ content }: { content: ContentStrategyContent }) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold text-gray-900 mb-2">Primary Channels</h3>
        <div className="flex flex-wrap gap-2">
          {content.channels?.slice(0, 4).map((channel: string, index: number) => (
            <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
              {channel}
            </span>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-gray-900 mb-2">Content Tone</h3>
        <p className="text-gray-700 text-sm">{content.tone}</p>
      </div>

      <div>
        <h3 className="font-semibold text-gray-900 mb-2">Hook Templates</h3>
        <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
          {content.hooks_7?.slice(0, 3).map((hook: string, index: number) => (
            <li key={index}>{hook}</li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="font-semibold text-gray-900 mb-2">30-Day Themes</h3>
        <ul className="space-y-1">
          {content.thirty_day_themes?.slice(0, 2).map((theme: string, index: number) => (
            <li key={index} className="flex items-start gap-2">
              <span className="font-medium text-green-600 text-xs">Week {index + 1}:</span>
              <span className="text-gray-700 text-xs">{theme.replace(/^Week \d+:\s*/, '')}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
