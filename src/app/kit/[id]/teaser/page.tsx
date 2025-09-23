'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { ArrowRight, ArrowLeft, Check, Lock, Eye, EyeOff } from 'lucide-react';

interface KitData {
  id: string;
  title: string;
  one_liner: string;
}

interface TeaserOption {
  id: string;
  title: string;
  preview: string;
  fullContent: string;
  selected?: boolean;
}

interface StepData {
  step: number;
  title: string;
  description: string;
  options: TeaserOption[];
}

export default function TeaserPage({ params }: { params: Promise<{ id: string }> }) {
  const [kit, setKit] = useState<KitData | null>(null);
  const [kitId, setKitId] = useState<string>('');
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<{[key: number]: string}>({});
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

  const steps: StepData[] = [
    {
      step: 1,
      title: "Business Case & Strategy",
      description: "Choose your positioning approach",
      options: [
        {
          id: 'A',
          title: 'Option A: Market-First Approach',
          preview: 'Position as the premium solution in a growing market...',
          fullContent: 'Position as the premium solution in a growing market. Target professionals who value quality and are willing to pay for convenience. Focus on ROI and time-saving benefits. Pricing: £50-100/month subscription model.'
        },
        {
          id: 'B', 
          title: 'Option B: Problem-First Approach',
          preview: 'Solve the biggest pain point in your industry...',
          fullContent: 'Solve the biggest pain point in your industry. Target frustrated users of existing solutions. Focus on ease of use and immediate results. Pricing: £25-50 one-time or low monthly fee.'
        },
        {
          id: 'C',
          title: 'Option C: Community-First Approach', 
          preview: 'Build around a passionate community of users...',
          fullContent: 'Build around a passionate community of users. Target early adopters and enthusiasts. Focus on exclusivity and insider benefits. Pricing: £15-30/month with premium tiers.'
        }
      ]
    },
    {
      step: 2,
      title: "Content Strategy",
      description: "Pick your content focus",
      options: [
        {
          id: 'A',
          title: 'Option A: Educational Content',
          preview: 'Focus on teaching and building authority through...',
          fullContent: 'Focus on teaching and building authority through educational content. Primary platforms: LinkedIn, YouTube, Blog. Post 3x/week with tutorials, case studies, and industry insights. Hook: "The mistake 90% of [your audience] make..."'
        },
        {
          id: 'B',
          title: 'Option B: Behind-the-Scenes',
          preview: 'Share your journey and build personal connection...',
          fullContent: 'Share your journey and build personal connection through authentic storytelling. Primary platforms: Instagram, TikTok, Twitter. Post daily with process videos, failures, and wins. Hook: "Day 30 of building [your business]..."'
        },
        {
          id: 'C', 
          title: 'Option C: Results-Driven',
          preview: 'Showcase success stories and social proof...',
          fullContent: 'Showcase success stories and social proof through results-focused content. Primary platforms: Instagram, Facebook, Email. Post 2x/week with testimonials, metrics, and before/after. Hook: "How [customer] went from X to Y in 30 days..."'
        }
      ]
    },
    {
      step: 3,
      title: "Website Preview",
      description: "Choose your website angle",
      options: [
        {
          id: 'A',
          title: 'Option A: Value-Led Website',
          preview: 'Clear benefits and ROI-focused messaging...',
          fullContent: 'Clear benefits and ROI-focused messaging. Hero: "Save 10 hours per week with [your solution]". Value props: Time-saving, Cost-effective, Proven results. CTA: "Start saving time today"'
        },
        {
          id: 'B',
          title: 'Option B: Story-Led Website',
          preview: 'Personal journey and mission-driven approach...',
          fullContent: 'Personal journey and mission-driven approach. Hero: "I started [business] because I was frustrated with [problem]". About: Your story, the problem you solved, your mission. CTA: "Join our community"'
        },
        {
          id: 'C',
          title: 'Option C: Results-Led Website',
          preview: 'Social proof and case study focused...',
          fullContent: 'Social proof and case study focused. Hero: "Join 500+ customers who have [achieved result]". Social proof: Testimonials, logos, numbers. CTA: "Get the same results"'
        }
      ]
    }
  ];

  const handleOptionSelect = (optionId: string) => {
    setSelectedOptions(prev => ({
      ...prev,
      [currentStep]: optionId
    }));
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Redirect to paywall
      window.location.href = `/kit/${kitId}/paywall`;
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const currentStepData = steps[currentStep - 1];
  const isStepComplete = selectedOptions[currentStep] !== undefined;
  const canProceed = isStepComplete;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading your options...</p>
        </div>
      </div>
    );
  }

  if (!kit) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Kit not found</h1>
          <p className="text-gray-600 mt-2">The kit you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{kit.title}</h1>
              <p className="text-gray-600">{kit.one_liner}</p>
            </div>
            <div className="text-sm text-gray-500">
              Step {currentStep} of 3
            </div>
          </div>
        </div>
      </div>

      {/* Progress Stepper */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.step} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                  currentStep > step.step 
                    ? 'bg-green-500 text-white' 
                    : currentStep === step.step 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {currentStep > step.step ? <Check className="h-4 w-4" /> : step.step}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">{step.title}</p>
                  <p className="text-xs text-gray-500">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="flex-1 h-px bg-gray-200 mx-4"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{currentStepData.title}</h2>
          <p className="text-lg text-gray-600">{currentStepData.description}</p>
        </div>

        {/* Options */}
        <div className="space-y-4 mb-8">
          {currentStepData.options.map((option) => (
            <div
              key={option.id}
              className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${
                selectedOptions[currentStep] === option.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleOptionSelect(option.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{option.title}</h3>
                  <div className="relative">
                    <p className="text-gray-600 mb-2">{option.preview}</p>
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent pointer-events-none"></div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Eye className="h-4 w-4" />
                      <span>Click to see more</span>
                    </div>
                  </div>
                </div>
                <div className="ml-4">
                  {selectedOptions[currentStep] === option.id ? (
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 border-2 border-gray-300 rounded-full"></div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          <Button
            onClick={handleNext}
            disabled={!canProceed}
            className="flex items-center gap-2"
          >
            {currentStep === 3 ? 'Continue to Payment' : 'Next'}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Help Text */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            {currentStep === 1 && "Choose the business approach that feels right for your idea"}
            {currentStep === 2 && "Pick the content strategy that matches your style"}
            {currentStep === 3 && "Select the website angle that will convert best"}
          </p>
        </div>
      </div>
    </div>
  );
}
