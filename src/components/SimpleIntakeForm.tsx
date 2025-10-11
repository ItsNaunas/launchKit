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
  defaultValues?: Partial<SimpleIntakeData>;
}

export function SimpleIntakeForm({ onSubmit, isLoading = false, defaultValues }: SimpleIntakeFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SimpleIntakeData>({
    resolver: zodResolver(simpleIntakeSchema),
    defaultValues: defaultValues || {},
  });

  return (
    <div className="max-w-3xl mx-auto p-10 bg-gradient-to-br from-charcoal-800/40 to-charcoal-900/20 border border-white/10 rounded-3xl backdrop-blur-sm shadow-2xl">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-semibold text-white mb-4 tracking-tight">
          Let&apos;s Turn Your Idea Into Viral Content
        </h1>
        <p className="text-xl text-silver-400 font-light leading-relaxed">
          Get scroll-stopping, TikTok/YouTube-style content ideas that could actually go viral.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        
        <div>
          <Input
            label="What&apos;s your business idea?"
            {...register('business_idea')}
            placeholder="e.g., Personal finance coaching for Gen Z creators"
            error={errors.business_idea?.message}
            required
            className="bg-charcoal-800/40 border-white/10 text-white placeholder-silver-500 focus:border-mint-500/40 focus:bg-charcoal-800/60"
          />
          <p className="text-sm text-silver-500 mt-2 font-light">
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
            className="bg-charcoal-800/40 border-white/10 text-white placeholder-silver-500 focus:border-mint-500/40 focus:bg-charcoal-800/60"
          />
          <p className="text-sm text-silver-500 mt-2 font-light">
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
            className="bg-charcoal-800/40 border-white/10 text-white placeholder-silver-500 focus:border-mint-500/40 focus:bg-charcoal-800/60"
          />
          <p className="text-sm text-silver-500 mt-2 font-light">
            Viral content shows extreme results, experiments, or transformations - what&apos;s yours?
          </p>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center pt-8 border-t border-white/10">
          <Button
            type="submit"
            disabled={isLoading}
            className="px-12 py-4 bg-white hover:bg-silver-100 text-black transition-all duration-300 font-medium text-lg"
          >
            {isLoading ? 'Creating Your Kit...' : 'Generate My Analysis'}
          </Button>
        </div>
      </form>
    </div>
  );
}
