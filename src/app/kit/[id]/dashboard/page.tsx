'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Download, RefreshCw, FileText, Users, Calendar, TrendingUp } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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

export default function KitDashboardPage({ params }: { params: Promise<{ id: string }> }) {
  const [kit, setKit] = useState<KitData | null>(null);
  const [outputs, setOutputs] = useState<OutputData>({});
  const [isLoading, setIsLoading] = useState(true);
  const [generating, setGenerating] = useState<string | null>(null);
  const [kitId, setKitId] = useState<string>('');

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

          // If user has access, fetch outputs
          if (kitData.has_access) {
            const outputsResponse = await fetch(`/api/kits/${kitId}/outputs`);
            if (outputsResponse.ok) {
              const outputsData = await outputsResponse.json();
              setOutputs(outputsData);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [kitId]);

  const handleGenerate = async (type: 'business_case' | 'content_strategy', regenerate = false) => {
    setGenerating(type);
    try {
      const response = await fetch(`/api/kits/${kitId}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type, regenerate }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Generation failed');
      }

      const { content, regens_remaining } = await response.json();
      
      // Update outputs state
      setOutputs(prev => ({
        ...prev,
        [type]: {
          id: `temp-${Date.now()}`,
          content,
          regen_count: 3 - regens_remaining,
          regens_remaining,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      }));

    } catch (error) {
      console.error('Generation error:', error);
      alert(error instanceof Error ? error.message : 'Failed to generate content');
    } finally {
      setGenerating(null);
    }
  };

  const handleDownloadPDF = async (type: 'business_case' | 'content_strategy') => {
    const output = outputs[type];
    if (!output) return;

    try {
      // Create a temporary container for the content
      const container = document.createElement('div');
      container.style.padding = '40px';
      container.style.backgroundColor = 'white';
      container.style.fontFamily = 'Arial, sans-serif';
      container.style.lineHeight = '1.6';
      container.style.color = '#333';
      
      // Format content for PDF
      if (type === 'business_case') {
        container.innerHTML = formatBusinessCasePDF(output.content, kit?.title || '');
      } else {
        container.innerHTML = formatContentStrategyPDF(output.content, kit?.title || '');
      }

      // Temporarily add to DOM
      document.body.appendChild(container);

      // Generate PDF
      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Clean up
      document.body.removeChild(container);

      // Download
      const filename = `${kit?.title}-${type.replace(/_/g, '-')}.pdf`;
      pdf.save(filename);

    } catch (error) {
      console.error('PDF generation error:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading your dashboard...</p>
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

  if (!kit.has_access) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Access Required</h1>
          <p className="text-gray-600 mt-2 mb-4">Please complete payment to access your launch kit.</p>
          <Button onClick={() => window.location.href = `/kit/${kitId}/preview`}>
            Go to Payment
          </Button>
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
              <div className="text-lg font-semibold text-green-600">✓ Paid Access</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Business Case Section */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="h-6 w-6 text-blue-600" />
                  <h2 className="text-xl font-semibold text-gray-900">Business Case</h2>
                </div>
                <div className="flex items-center gap-2">
                  {outputs.business_case && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadPDF('business_case')}
                        className="flex items-center gap-2"
                      >
                        <Download className="h-4 w-4" />
                        PDF
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleGenerate('business_case', true)}
                        disabled={generating === 'business_case' || outputs.business_case.regens_remaining === 0}
                        className="flex items-center gap-2"
                      >
                        <RefreshCw className={`h-4 w-4 ${generating === 'business_case' ? 'animate-spin' : ''}`} />
                        Regen ({outputs.business_case.regens_remaining})
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6">
              {outputs.business_case ? (
                <BusinessCaseDisplay content={outputs.business_case.content} />
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">Generate your business case analysis</p>
                  <Button
                    onClick={() => handleGenerate('business_case')}
                    disabled={generating === 'business_case'}
                    className="flex items-center gap-2"
                  >
                    {generating === 'business_case' ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <TrendingUp className="h-4 w-4" />
                    )}
                    Generate Business Case
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Content Strategy Section */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Calendar className="h-6 w-6 text-green-600" />
                  <h2 className="text-xl font-semibold text-gray-900">Content Strategy</h2>
                </div>
                <div className="flex items-center gap-2">
                  {outputs.content_strategy && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadPDF('content_strategy')}
                        className="flex items-center gap-2"
                      >
                        <Download className="h-4 w-4" />
                        PDF
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleGenerate('content_strategy', true)}
                        disabled={generating === 'content_strategy' || outputs.content_strategy.regens_remaining === 0}
                        className="flex items-center gap-2"
                      >
                        <RefreshCw className={`h-4 w-4 ${generating === 'content_strategy' ? 'animate-spin' : ''}`} />
                        Regen ({outputs.content_strategy.regens_remaining})
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6">
              {outputs.content_strategy ? (
                <ContentStrategyDisplay content={outputs.content_strategy.content} />
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">Generate your content strategy</p>
                  <Button
                    onClick={() => handleGenerate('content_strategy')}
                    disabled={generating === 'content_strategy'}
                    className="flex items-center gap-2"
                  >
                    {generating === 'content_strategy' ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <Users className="h-4 w-4" />
                    )}
                    Generate Content Strategy
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Component to display business case content
function BusinessCaseDisplay({ content }: { content: BusinessCaseContent }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-gray-900 mb-2">Positioning</h3>
        <p className="text-gray-700">{content.positioning}</p>
      </div>
      
      <div>
        <h3 className="font-semibold text-gray-900 mb-2">Value Proposition</h3>
        <p className="text-gray-700">{content.value_prop}</p>
      </div>

      <div>
        <h3 className="font-semibold text-gray-900 mb-2">Target Audience</h3>
        <p className="text-gray-700">{content.audience_summary}</p>
      </div>

      <div>
        <h3 className="font-semibold text-gray-900 mb-2">Key Offer Points</h3>
        <ul className="list-disc list-inside space-y-1 text-gray-700">
          {content.offer_bullets?.map((bullet: string, index: number) => (
            <li key={index}>{bullet}</li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="font-semibold text-gray-900 mb-2">Next Steps</h3>
        <ol className="list-decimal list-inside space-y-1 text-gray-700">
          {content.first_3_steps?.map((step: string, index: number) => (
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
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-gray-900 mb-2">Primary Channels</h3>
        <div className="flex flex-wrap gap-2">
          {content.channels?.map((channel: string, index: number) => (
            <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              {channel}
            </span>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-gray-900 mb-2">Posting Schedule</h3>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(content.cadence || {}).map(([channel, frequency]) => (
            <div key={channel} className="flex justify-between py-2">
              <span className="text-gray-700">{channel}:</span>
              <span className="font-medium text-gray-900">{frequency as string}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-gray-900 mb-2">Content Tone</h3>
        <p className="text-gray-700">{content.tone}</p>
      </div>

      <div>
        <h3 className="font-semibold text-gray-900 mb-2">Hook Templates</h3>
        <ul className="list-disc list-inside space-y-1 text-gray-700">
          {content.hooks_7?.slice(0, 3).map((hook: string, index: number) => (
            <li key={index}>{hook}</li>
          ))}
        </ul>
        {content.hooks_7?.length > 3 && (
          <p className="text-sm text-gray-500 mt-2">+ {content.hooks_7.length - 3} more in PDF</p>
        )}
      </div>

      <div>
        <h3 className="font-semibold text-gray-900 mb-2">30-Day Themes</h3>
        <ul className="space-y-2">
          {content.thirty_day_themes?.map((theme: string, index: number) => (
            <li key={index} className="flex items-start gap-2">
              <span className="font-medium text-blue-600 text-sm">Week {index + 1}:</span>
              <span className="text-gray-700 text-sm">{theme.replace(/^Week \d+:\s*/, '')}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// Helper functions for PDF formatting
function formatBusinessCasePDF(content: BusinessCaseContent, title: string): string {
  return `
    <h1 style="color: #1f2937; border-bottom: 2px solid #3b82f6; padding-bottom: 10px; margin-bottom: 20px;">
      ${title} - Business Case
    </h1>
    
    <h2 style="color: #1f2937; margin-top: 30px; margin-bottom: 15px;">Positioning</h2>
    <p style="margin-bottom: 20px;">${content.positioning}</p>
    
    <h2 style="color: #1f2937; margin-top: 30px; margin-bottom: 15px;">Value Proposition</h2>
    <p style="margin-bottom: 20px;">${content.value_prop}</p>
    
    <h2 style="color: #1f2937; margin-top: 30px; margin-bottom: 15px;">Target Audience Analysis</h2>
    <p style="margin-bottom: 20px;">${content.audience_summary}</p>
    
    <h2 style="color: #1f2937; margin-top: 30px; margin-bottom: 15px;">Key Offer Points</h2>
    <ul style="margin-bottom: 20px;">
      ${content.offer_bullets?.map((bullet: string) => `<li style="margin-bottom: 8px;">${bullet}</li>`).join('')}
    </ul>
    
    <h2 style="color: #1f2937; margin-top: 30px; margin-bottom: 15px;">Brand Identity</h2>
    <p style="margin-bottom: 10px;"><strong>Vibe:</strong> ${content.brand_identity?.vibe}</p>
    <p style="margin-bottom: 20px;"><strong>Keywords:</strong> ${content.brand_identity?.keywords?.join(', ')}</p>
    
    <h2 style="color: #1f2937; margin-top: 30px; margin-bottom: 15px;">Pricing Strategy</h2>
    <p style="margin-bottom: 10px;"><strong>Recommendation:</strong> ${content.pricing?.idea}</p>
    <p style="margin-bottom: 20px;"><strong>Alternatives:</strong></p>
    <ul style="margin-bottom: 20px;">
      ${content.pricing?.alternatives?.map((alt: string) => `<li style="margin-bottom: 8px;">${alt}</li>`).join('')}
    </ul>
    
    <h2 style="color: #1f2937; margin-top: 30px; margin-bottom: 15px;">Business Name Ideas</h2>
    <ul style="margin-bottom: 20px;">
      ${content.name_ideas?.map((name: string) => `<li style="margin-bottom: 8px;">${name}</li>`).join('')}
    </ul>
    
    <h2 style="color: #1f2937; margin-top: 30px; margin-bottom: 15px;">Tagline Options</h2>
    <ul style="margin-bottom: 20px;">
      ${content.taglines?.map((tagline: string) => `<li style="margin-bottom: 8px;">"${tagline}"</li>`).join('')}
    </ul>
    
    <h2 style="color: #1f2937; margin-top: 30px; margin-bottom: 15px;">Key Risks</h2>
    <ul style="margin-bottom: 20px;">
      ${content.risks?.map((risk: string) => `<li style="margin-bottom: 8px;">${risk}</li>`).join('')}
    </ul>
    
    <h2 style="color: #1f2937; margin-top: 30px; margin-bottom: 15px;">Next Steps</h2>
    <ol style="margin-bottom: 20px;">
      ${content.first_3_steps?.map((step: string) => `<li style="margin-bottom: 8px;">${step}</li>`).join('')}
    </ol>
  `;
}

function formatContentStrategyPDF(content: ContentStrategyContent, title: string): string {
  return `
    <h1 style="color: #1f2937; border-bottom: 2px solid #10b981; padding-bottom: 10px; margin-bottom: 20px;">
      ${title} - Content Strategy
    </h1>
    
    <h2 style="color: #1f2937; margin-top: 30px; margin-bottom: 15px;">Primary Channels</h2>
    <p style="margin-bottom: 20px;">${content.channels?.join(', ')}</p>
    
    <h2 style="color: #1f2937; margin-top: 30px; margin-bottom: 15px;">Posting Schedule</h2>
    <ul style="margin-bottom: 20px;">
      ${Object.entries(content.cadence || {}).map(([channel, frequency]) => 
        `<li style="margin-bottom: 8px;"><strong>${channel}:</strong> ${frequency}</li>`
      ).join('')}
    </ul>
    
    <h2 style="color: #1f2937; margin-top: 30px; margin-bottom: 15px;">Content Tone & Voice</h2>
    <p style="margin-bottom: 20px;">${content.tone}</p>
    
    <h2 style="color: #1f2937; margin-top: 30px; margin-bottom: 15px;">Hook Templates</h2>
    <ol style="margin-bottom: 20px;">
      ${content.hooks_7?.map((hook: string) => `<li style="margin-bottom: 8px;">${hook}</li>`).join('')}
    </ol>
    
    <h2 style="color: #1f2937; margin-top: 30px; margin-bottom: 15px;">30-Day Content Themes</h2>
    <ul style="margin-bottom: 20px;">
      ${content.thirty_day_themes?.map((theme: string) => `<li style="margin-bottom: 12px;">${theme}</li>`).join('')}
    </ul>
  `;
}
