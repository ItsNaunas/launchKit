'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TabsContainer, ProgressIndicator, type TabKey } from '@/components/TabsContainer';
import { BusinessCaseTab } from '@/components/tabs/BusinessCaseTab';
import { ContentStrategyTab } from '@/components/tabs/ContentStrategyTab';
import { WebsiteTab } from '@/components/tabs/WebsiteTab';
import { Button } from '@/components/ui/Button';
import { Sparkles, ShoppingCart, Lock } from 'lucide-react';
import { type KitData, type BusinessCaseContent, type ContentStrategyContent } from '@/lib/shared-types';
import { useAuth } from '@/contexts/AuthContext';
import { AuthModal } from '@/components/AuthModal';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function KitTabsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { user } = useAuth();
  const [kitId, setKitId] = useState<string>('');
  const [kit, setKit] = useState<KitData | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>('business_case');
  const [isLoading, setIsLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingGeneration, setPendingGeneration] = useState<{ type: 'business_case' | 'content_strategy'; regenerate: boolean } | null>(null);
  
  // Output states
  const [businessCaseOutput, setBusinessCaseOutput] = useState<any>(null);
  const [contentStrategyOutput, setContentStrategyOutput] = useState<any>(null);
  
  // Completion states
  const [completions, setCompletions] = useState({
    business_case: false,
    content_strategy: false,
    website: false,
  });

  // Resolve params
  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params;
      setKitId(resolvedParams.id);
    };
    resolveParams();
  }, [params]);

  // Fetch kit data and outputs
  useEffect(() => {
    if (!kitId) return;
    
    const fetchData = async () => {
      try {
        // Fetch kit
        const kitResponse = await fetch(`/api/kits/${kitId}`);
        if (kitResponse.ok) {
          const kitData = await kitResponse.json();
          setKit(kitData);
        }

        // Fetch outputs
        const outputsResponse = await fetch(`/api/kits/${kitId}/outputs`);
        if (outputsResponse.ok) {
          const outputsData = await outputsResponse.json();
          if (outputsData.business_case) {
            setBusinessCaseOutput(outputsData.business_case);
          }
          if (outputsData.content_strategy) {
            setContentStrategyOutput(outputsData.content_strategy);
          }
        }

        // Fetch completion states from database
        const completionsResponse = await fetch(`/api/kits/${kitId}/completions`);
        if (completionsResponse.ok) {
          const completionsData = await completionsResponse.json();
          setCompletions(completionsData.completions);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [kitId]);

  // Generate handlers with auth check
  const handleGenerateBusinessCase = async (regenerate: boolean) => {
    // Check if user is authenticated
    if (!user && !regenerate) {
      // First time generating and not logged in - show auth modal
      setPendingGeneration({ type: 'business_case', regenerate });
      setShowAuthModal(true);
      return;
    }

    const response = await fetch(`/api/kits/${kitId}/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'business_case', regenerate }),
    });

    if (!response.ok) {
      throw new Error('Generation failed');
    }

    const { content, regens_remaining } = await response.json();
    setBusinessCaseOutput({
      content,
      regen_count: regenerate ? (businessCaseOutput?.regen_count ?? 0) + 1 : 0,
      regens_remaining,
    });
  };

  const handleGenerateContentStrategy = async (regenerate: boolean) => {
    // Check if user is authenticated
    if (!user && !regenerate) {
      // First time generating and not logged in - show auth modal
      setPendingGeneration({ type: 'content_strategy', regenerate });
      setShowAuthModal(true);
      return;
    }

    const response = await fetch(`/api/kits/${kitId}/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'content_strategy', regenerate }),
    });

    if (!response.ok) {
      throw new Error('Generation failed');
    }

    const { content, regens_remaining } = await response.json();
    setContentStrategyOutput({
      content,
      regen_count: regenerate ? (contentStrategyOutput?.regen_count ?? 0) + 1 : 0,
      regens_remaining,
    });
  };

  // Handle successful auth - resume pending generation
  const handleAuthSuccess = async () => {
    setShowAuthModal(false);
    
    if (pendingGeneration) {
      // Resume the generation that was interrupted
      if (pendingGeneration.type === 'business_case') {
        await handleGenerateBusinessCase(pendingGeneration.regenerate);
      } else {
        await handleGenerateContentStrategy(pendingGeneration.regenerate);
      }
      setPendingGeneration(null);
    }
  };

  // Mark complete handlers
  const handleMarkBusinessCaseComplete = async () => {
    try {
      const response = await fetch(`/api/kits/${kitId}/completions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tabKey: 'business_case',
          isComplete: true,
          outputId: businessCaseOutput?.id,
        }),
      });

      if (response.ok) {
        const { completions: updated } = await response.json();
        setCompletions(updated);
      }
    } catch (error) {
      console.error('Error marking complete:', error);
    }
  };

  const handleMarkContentStrategyComplete = async () => {
    try {
      const response = await fetch(`/api/kits/${kitId}/completions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tabKey: 'content_strategy',
          isComplete: true,
          outputId: contentStrategyOutput?.id,
        }),
      });

      if (response.ok) {
        const { completions: updated } = await response.json();
        setCompletions(updated);
      }
    } catch (error) {
      console.error('Error marking complete:', error);
    }
  };

  const handleMarkWebsiteComplete = async () => {
    try {
      const response = await fetch(`/api/kits/${kitId}/completions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tabKey: 'website',
          isComplete: true,
        }),
      });

      if (response.ok) {
        const { completions: updated } = await response.json();
        setCompletions(updated);
      }
    } catch (error) {
      console.error('Error marking complete:', error);
    }
  };

  // PDF download handlers
  const handleDownloadBusinessCasePDF = async () => {
    if (!businessCaseOutput) return;
    
    const container = document.createElement('div');
    container.style.padding = '40px';
    container.style.backgroundColor = 'white';
    container.style.fontFamily = 'Arial, sans-serif';
    container.innerHTML = formatBusinessCasePDF(businessCaseOutput.content, kit?.title || '');
    
    document.body.appendChild(container);
    const canvas = await html2canvas(container, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    document.body.removeChild(container);
    pdf.save(`${kit?.title}-business-case.pdf`);
  };

  const handleDownloadContentStrategyPDF = async () => {
    if (!contentStrategyOutput) return;
    
    const container = document.createElement('div');
    container.style.padding = '40px';
    container.style.backgroundColor = 'white';
    container.style.fontFamily = 'Arial, sans-serif';
    container.innerHTML = formatContentStrategyPDF(contentStrategyOutput.content, kit?.title || '');
    
    document.body.appendChild(container);
    const canvas = await html2canvas(container, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    document.body.removeChild(container);
    pdf.save(`${kit?.title}-content-strategy.pdf`);
  };

  // Check if all tabs are complete
  const completedCount = Object.values(completions).filter(Boolean).length;
  const allComplete = completedCount === 3;
  const hasCheckoutAccess = kit?.has_access ?? false;

  const handleCheckout = () => {
    if (!allComplete) {
      // Find first incomplete tab
      const firstIncomplete = (Object.entries(completions).find(([_, complete]) => !complete)?.[0] || 'business_case') as TabKey;
      setActiveTab(firstIncomplete);
      // Show friendly message
      const remaining = 3 - completedCount;
      alert(`Almost there! Please complete ${remaining} more section${remaining > 1 ? 's' : ''} to unlock checkout.\n\n✓ ${completedCount}/3 sections complete`);
      return;
    }
    
    router.push(`/kit/${kitId}/checkout`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-silver-400">Loading your launch kit...</p>
        </div>
      </div>
    );
  }

  if (!kit) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white">Kit not found</h1>
          <p className="text-silver-400 mt-2">The kit you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { key: 'business_case' as TabKey, label: 'Business Case', isComplete: completions.business_case },
    { key: 'content_strategy' as TabKey, label: 'Content Strategy', isComplete: completions.content_strategy },
    { key: 'website' as TabKey, label: 'Website', isComplete: completions.website },
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => {
          setShowAuthModal(false);
          setPendingGeneration(null);
        }}
        onSuccess={handleAuthSuccess}
      />

      {/* Top header */}
      <div className="bg-charcoal-900/50 border-b border-white/10 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="h-6 w-6 text-mint-500" />
              <div>
                <h1 className="text-xl font-semibold text-white">{kit.title}</h1>
                <p className="text-sm text-silver-500">{kit.one_liner}</p>
                {user && (
                  <p className="text-xs text-mint-400 mt-1">
                    Welcome back, {user.email?.split('@')[0]} – your success awaits you
                  </p>
                )}
              </div>
            </div>
            
            <Button
              onClick={handleCheckout}
              disabled={!allComplete}
              className={`
                ${allComplete 
                  ? 'bg-white hover:bg-silver-100 text-black' 
                  : 'bg-charcoal-800 text-silver-500 cursor-not-allowed'
                }
              `}
            >
              {allComplete ? (
                <>
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Checkout (£37)
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4 mr-2" />
                  Complete All Tabs
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <TabsContainer tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab}>
        {/* Progress indicator */}
        <ProgressIndicator completedCount={completedCount} totalCount={3} />

        {/* Tab content */}
        {activeTab === 'business_case' && (
          <BusinessCaseTab
            kitId={kitId}
            output={businessCaseOutput}
            isComplete={completions.business_case}
            isLoading={false}
            hasCheckoutAccess={hasCheckoutAccess}
            onGenerate={handleGenerateBusinessCase}
            onMarkComplete={handleMarkBusinessCaseComplete}
            onDownloadPDF={handleDownloadBusinessCasePDF}
          />
        )}

        {activeTab === 'content_strategy' && (
          <ContentStrategyTab
            kitId={kitId}
            output={contentStrategyOutput}
            isComplete={completions.content_strategy}
            isLoading={false}
            hasCheckoutAccess={hasCheckoutAccess}
            onGenerate={handleGenerateContentStrategy}
            onMarkComplete={handleMarkContentStrategyComplete}
            onDownloadPDF={handleDownloadContentStrategyPDF}
          />
        )}

        {activeTab === 'website' && (
          <WebsiteTab
            kitId={kitId}
            isComplete={completions.website}
            hasCheckoutAccess={hasCheckoutAccess}
            onMarkComplete={handleMarkWebsiteComplete}
          />
        )}
      </TabsContainer>
    </div>
  );
}

// PDF formatting helpers (simplified - reuse from existing dashboard)
function formatBusinessCasePDF(content: BusinessCaseContent, title: string): string {
  return `
    <h1 style="color: #1f2937; border-bottom: 2px solid #3b82f6; padding-bottom: 10px; margin-bottom: 20px;">
      ${title} - Business Case
    </h1>
    <h2>Positioning</h2><p>${content.positioning}</p>
    <h2>Value Proposition</h2><p>${content.value_prop}</p>
    <h2>Target Audience</h2><p>${content.audience_summary}</p>
    <h2>Key Offers</h2><ul>${content.offer_bullets?.map(b => `<li>${b}</li>`).join('')}</ul>
    <h2>Next Steps</h2><ol>${content.first_3_steps?.map(s => `<li>${s}</li>`).join('')}</ol>
  `;
}

function formatContentStrategyPDF(content: ContentStrategyContent, title: string): string {
  return `
    <h1 style="color: #1f2937; border-bottom: 2px solid #10b981; padding-bottom: 10px; margin-bottom: 20px;">
      ${title} - Content Strategy
    </h1>
    <h2>Channels</h2><p>${content.channels?.join(', ')}</p>
    <h2>Tone</h2><p>${content.tone}</p>
    <h2>Hooks</h2><ol>${content.hooks_7?.map(h => `<li>${h}</li>`).join('')}</ol>
    <h2>30-Day Themes</h2><ul>${content.thirty_day_themes?.map(t => `<li>${t}</li>`).join('')}</ul>
  `;
}

