'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Checkbox } from '@/components/ui/Checkbox';
import { Sparkles, ArrowRight } from 'lucide-react';

interface MiniIntakeData {
  business_idea: string;
  budget: 'shoestring' | 'moderate' | 'premium';
  challenges: string[];
}

interface FormErrors {
  business_idea?: string;
  challenges?: string;
}

const CHALLENGE_OPTIONS = [
  'Finding my target audience',
  'Creating compelling content',
  'Building a brand identity',
  'Setting the right price',
  'Getting first customers',
  'Time management',
  'Technical skills',
  'Marketing strategy',
  'Competition analysis',
  'Product development',
  'Other'
];

export function MiniIntakeForm({ onSubmit, isLoading }: { 
  onSubmit: (data: MiniIntakeData) => void;
  isLoading: boolean;
}) {
  const [formData, setFormData] = useState<MiniIntakeData>({
    business_idea: '',
    budget: 'moderate',
    challenges: []
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const handleChallengeToggle = (challenge: string) => {
    setFormData(prev => ({
      ...prev,
      challenges: prev.challenges.includes(challenge)
        ? prev.challenges.filter(c => c !== challenge)
        : [...prev.challenges, challenge]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors: FormErrors = {};
    if (!formData.business_idea.trim()) {
      newErrors.business_idea = 'Please describe your business idea';
    }
    if (formData.challenges.length === 0) {
      newErrors.challenges = 'Please select at least one challenge';
    }
    if (formData.challenges.length > 2) {
      newErrors.challenges = 'Please select maximum 2 challenges';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Sparkles className="h-8 w-8 text-orange-600" />
          <h1 className="text-3xl font-bold text-gray-900">What&apos;s your dream business?</h1>
        </div>
        <p className="text-lg text-gray-600">
          Tell us about your idea and we&apos;ll create a personalized launch strategy
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Business Idea */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Describe your business idea in one sentence
          </label>
          <Input
            type="text"
            placeholder="e.g., A subscription service for busy professionals to get healthy meals delivered"
            value={formData.business_idea}
            onChange={(e) => setFormData(prev => ({ ...prev, business_idea: e.target.value }))}
            className={errors.business_idea ? 'border-red-500' : ''}
          />
          {errors.business_idea && (
            <p className="text-red-500 text-sm mt-1">{errors.business_idea}</p>
          )}
        </div>

        {/* Budget */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            What&apos;s your budget for getting started?
          </label>
          <Select
            value={formData.budget}
            onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value as any }))}
          >
            <option value="shoestring">Shoestring (£0-100) - Just getting started</option>
            <option value="moderate">Moderate (£100-1000) - Some investment ready</option>
            <option value="premium">Premium (£1000+) - Ready to invest seriously</option>
          </Select>
        </div>

        {/* Top Challenges */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            What are your top 2 challenges? (Select up to 2)
          </label>
          <div className="grid grid-cols-2 gap-3">
            {CHALLENGE_OPTIONS.map((challenge) => (
              <label key={challenge} className="flex items-center space-x-2 cursor-pointer">
                <Checkbox
                  checked={formData.challenges.includes(challenge)}
                  onChange={() => handleChallengeToggle(challenge)}
                  disabled={!formData.challenges.includes(challenge) && formData.challenges.length >= 2}
                />
                <span className="text-sm text-gray-700">{challenge}</span>
              </label>
            ))}
          </div>
          {errors.challenges && (
            <p className="text-red-500 text-sm mt-1">{errors.challenges}</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2"
            size="lg"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Generating your options...
              </>
            ) : (
              <>
                Generate my Starter Kit
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </Button>
        </div>

        <p className="text-xs text-gray-500 text-center">
          ✨ Takes 30 seconds • No signup required • Instant preview
        </p>
      </form>
    </div>
  );
}
