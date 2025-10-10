'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { simpleIntakeSchema, type SimpleIntakeData } from '@/lib/validation';

interface SimpleIntakeFormProps {
  onSubmit: (data: SimpleIntakeData) => Promise<void>;
  isLoading?: boolean;
}

export function SimpleIntakeForm({ onSubmit, isLoading = false }: SimpleIntakeFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SimpleIntakeData>({
    resolver: zodResolver(simpleIntakeSchema),
  });

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Let&apos;s Turn Your Idea Into Viral Content
        </h1>
        <p className="text-gray-600">
          Get scroll-stopping, TikTok/YouTube-style content ideas that could actually go viral.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        
        <div>
          <Input
            label="What&apos;s your business idea?"
            {...register('business_idea')}
            placeholder="e.g., Personal finance coaching for Gen Z creators"
            error={errors.business_idea?.message}
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Be specific - what makes it different or interesting?
          </p>
        </div>
        
        <div>
          <Textarea
            label="Who would stop scrolling to watch content about this?"
            {...register('target_audience')}
            placeholder="e.g., 18-28 year old TikTok creators making their first $1k/month who are terrible with money and want to build wealth without giving up their lifestyle"
            error={errors.target_audience?.message}
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Think about who would save or share viral content about this topic
          </p>
        </div>

        <div>
          <Textarea
            label="What transformation or jaw-dropping result can you show?"
            {...register('main_challenge')}
            placeholder="e.g., Turning $0 into $10k in 90 days, helping someone go from 0 to 100k followers, dramatic before/after transformations..."
            error={errors.main_challenge?.message}
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Viral content shows extreme results, experiments, or transformations - what&apos;s yours?
          </p>
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
