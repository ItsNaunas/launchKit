'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';

interface SimpleIntakeData {
  business_idea: string;
  target_audience: string;
  main_challenge: string;
}

interface SimpleIntakeFormProps {
  onSubmit: (data: SimpleIntakeData) => Promise<void>;
  isLoading?: boolean;
}

export function SimpleIntakeForm({ onSubmit, isLoading = false }: SimpleIntakeFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SimpleIntakeData>();

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Tell Us About Your Business Idea
        </h1>
        <p className="text-gray-600">
          We&apos;ll create a personalized launch strategy just for you.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        
        <div>
          <Input
            label="What's your business idea?"
            {...register('business_idea', { required: 'Business idea is required' })}
            placeholder="e.g., Local dog walking service for busy professionals"
            error={errors.business_idea?.message}
            required
          />
        </div>
        
        <div>
          <Textarea
            label="Who is your target audience?"
            {...register('target_audience', { required: 'Target audience is required' })}
            placeholder="Describe your ideal customers - their age, profession, pain points, goals..."
            error={errors.target_audience?.message}
            required
          />
        </div>

        <div>
          <Textarea
            label="What's your biggest challenge right now?"
            {...register('main_challenge', { required: 'Main challenge is required' })}
            placeholder="What's holding you back from launching? (e.g., finding customers, pricing, time, skills...)"
            error={errors.main_challenge?.message}
            required
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-6 border-t">
          <Button
            type="submit"
            disabled={isLoading}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Creating Your Kit...' : 'Generate My Analysis'}
          </Button>
        </div>
      </form>
    </div>
  );
}
