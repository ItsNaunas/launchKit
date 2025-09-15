'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { IntakeSchema, type IntakeFormData } from '@/lib/schemas';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Checkbox } from '@/components/ui/Checkbox';

interface IntakeFormProps {
  onSubmit: (data: IntakeFormData) => Promise<void>;
  isLoading?: boolean;
}

export function IntakeForm({ onSubmit, isLoading = false }: IntakeFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<IntakeFormData>({
    resolver: zodResolver(IntakeSchema),
    defaultValues: {
      competitor_links: [],
      inspiration_links: [],
      content_strengths: [],
    }
  });

  const challenges = watch('top_3_challenges') || ['', '', ''];

  const handleChallengeChange = (index: number, value: string) => {
    const newChallenges = [...challenges];
    newChallenges[index] = value;
    setValue('top_3_challenges', newChallenges);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Launch Your Idea with AI
        </h1>
        <p className="text-gray-600">
          Tell us about your business idea and we'll create a complete launch kit tailored for you.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        
        {/* Essential Information */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">
            Essential Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Input
                label="Idea Title"
                {...register('idea_title')}
                placeholder="e.g., Local Dog Walking Service"
                error={errors.idea_title?.message}
                required
              />
            </div>
            
            <div>
              <Select
                label="Category"
                {...register('category')}
                error={errors.category?.message}
                required
              >
                <option value="">Select category</option>
                <option value="service">Service</option>
                <option value="product">Product</option>
                <option value="local">Local Business</option>
                <option value="content">Content/Media</option>
                <option value="e-com">E-commerce</option>
                <option value="saas">SaaS/Software</option>
              </Select>
            </div>
          </div>

          <div>
            <Textarea
              label="One-Liner Description"
              {...register('one_liner')}
              placeholder="Describe your idea in one compelling sentence (max 140 characters)"
              maxLength={140}
              error={errors.one_liner?.message}
              required
            />
          </div>

          <div>
            <Textarea
              label="Target Audience"
              {...register('target_audience')}
              placeholder="Who are your ideal customers? Be specific about demographics, interests, pain points..."
              error={errors.target_audience?.message}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Select
                label="Primary Goal"
                {...register('primary_goal')}
                error={errors.primary_goal?.message}
                required
              >
                <option value="">Select goal</option>
                <option value="launch">Just Launch</option>
                <option value="first_sales">Get First Sales</option>
                <option value="validate">Validate Idea</option>
                <option value="brand">Build Brand</option>
              </Select>
            </div>

            <div>
              <Select
                label="Budget Range"
                {...register('budget_band')}
                error={errors.budget_band?.message}
                required
              >
                <option value="">Select budget</option>
                <option value="none">No Budget</option>
                <option value="<100">Under £100</option>
                <option value="100-500">£100 - £500</option>
                <option value="500-2000">£500 - £2,000</option>
                <option value=">2000">Over £2,000</option>
              </Select>
            </div>

            <div>
              <Select
                label="Time Horizon"
                {...register('time_horizon')}
                error={errors.time_horizon?.message}
                required
              >
                <option value="">Select timeframe</option>
                <option value="2w">2 Weeks</option>
                <option value="30d">30 Days</option>
                <option value="60d">60 Days</option>
              </Select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Top 3 Challenges <span className="text-red-500">*</span>
            </label>
            <div className="space-y-3">
              {[0, 1, 2].map((index) => (
                <Input
                  key={index}
                  placeholder={`Challenge ${index + 1}`}
                  value={challenges[index] || ''}
                  onChange={(e) => handleChallengeChange(index, e.target.value)}
                  error={errors.top_3_challenges?.[index]?.message}
                />
              ))}
            </div>
            {errors.top_3_challenges?.message && (
              <p className="text-red-500 text-sm mt-1">{errors.top_3_challenges.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Select
                label="Geography"
                {...register('geography')}
                error={errors.geography?.message}
                required
              >
                <option value="">Select region</option>
                <option value="UK">UK</option>
                <option value="EU">Europe</option>
                <option value="US">United States</option>
                <option value="global">Global</option>
              </Select>
            </div>

            <div>
              <Select
                label="Brand Vibe"
                {...register('brand_vibe')}
                error={errors.brand_vibe?.message}
                required
              >
                <option value="">Select vibe</option>
                <option value="luxury">Luxury & Scarce</option>
                <option value="accessible">Accessible & Friendly</option>
                <option value="edgy">Bold & Edgy</option>
                <option value="minimal">Calm & Minimal</option>
              </Select>
            </div>

            <div>
              <Select
                label="Main Sales Channel"
                {...register('sales_channel_focus')}
                error={errors.sales_channel_focus?.message}
                required
              >
                <option value="">Select channel</option>
                <option value="IG">Instagram</option>
                <option value="TikTok">TikTok</option>
                <option value="X">X (Twitter)</option>
                <option value="YouTube">YouTube</option>
                <option value="Etsy">Etsy</option>
                <option value="Shopify">Shopify</option>
                <option value="Offline">Offline/Local</option>
                <option value="Mixed">Mixed Channels</option>
              </Select>
            </div>
          </div>
        </section>

        {/* Optional Helpful Information */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">
            Additional Details <span className="text-gray-500 text-sm font-normal">(Optional)</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Select
                label="Business Model"
                {...register('business_model')}
                error={errors.business_model?.message}
              >
                <option value="">Select model</option>
                <option value="one_off">One-off Sales</option>
                <option value="subscription">Subscription</option>
                <option value="services">Services</option>
                <option value="affiliate">Affiliate</option>
                <option value="ads">Advertising</option>
              </Select>
            </div>

            <div>
              <Select
                label="Fulfilment Method"
                {...register('fulfilment')}
                error={errors.fulfilment?.message}
              >
                <option value="">Select method</option>
                <option value="digital">Digital</option>
                <option value="physical">Physical</option>
                <option value="service">Service</option>
                <option value="mixed">Mixed</option>
              </Select>
            </div>
          </div>

          <div>
            <Input
              label="Pricing Ideas"
              {...register('pricing_idea')}
              placeholder="Any initial thoughts on pricing?"
              error={errors.pricing_idea?.message}
            />
          </div>

          <div>
            <Textarea
              label="Constraints"
              {...register('constraints')}
              placeholder="Any limitations in time, tools, skills, or resources?"
              error={errors.constraints?.message}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Competitor Links
            </label>
            <div className="space-y-2">
              {[0, 1, 2, 3, 4].map((index) => (
                <Input
                  key={index}
                  placeholder={`Competitor URL ${index + 1} (optional)`}
                  {...register(`competitor_links.${index}` as const)}
                  error={errors.competitor_links?.[index]?.message}
                />
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Add up to 5 competitor websites for analysis
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Inspiration Links
            </label>
            <div className="space-y-2">
              {[0, 1, 2, 3, 4].map((index) => (
                <Input
                  key={index}
                  placeholder={`Inspiration URL ${index + 1} (optional)`}
                  {...register(`inspiration_links.${index}` as const)}
                  error={errors.inspiration_links?.[index]?.message}
                />
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Add up to 5 websites that inspire your vision
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Content Strengths
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {['writing', 'video', 'design', 'voice', 'none'].map((strength) => (
                <label key={strength} className="flex items-center space-x-2">
                  <Checkbox
                    {...register('content_strengths')}
                    value={strength}
                  />
                  <span className="text-sm text-gray-700 capitalize">
                    {strength === 'none' ? 'None of these' : strength}
                  </span>
                </label>
              ))}
            </div>
            {errors.content_strengths?.message && (
              <p className="text-red-500 text-sm mt-1">{errors.content_strengths.message}</p>
            )}
          </div>

          <div>
            <Input
              label="30-Day Revenue Target"
              type="number"
              {...register('revenue_target_30d', { valueAsNumber: true })}
              placeholder="£ (optional)"
              error={errors.revenue_target_30d?.message}
            />
          </div>
        </section>

        {/* Submit Button */}
        <div className="flex justify-end pt-6 border-t">
          <Button
            type="submit"
            disabled={isLoading}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Creating Your Kit...' : 'Create My Launch Kit'}
          </Button>
        </div>
      </form>
    </div>
  );
}
