'use client';

import { buttonVariants } from '@/components/ui/Button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useMediaQuery } from '@/hooks/use-media-query';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Check, Zap } from 'lucide-react';
import Link from 'next/link';
import { useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import NumberFlow from '@number-flow/react';

// LaunchKit pricing plans
const plans = [
  {
    name: 'PAY ONCE',
    price: 37,
    dailyPrice: 37,
    period: 'one-time',
    features: [
      'Complete business case & strategy',
      '30-day content strategy',
      'Downloadable PDFs',
      '3 regenerations per section',
      'Instant access',
    ],
    description: 'Perfect for immediate access to your complete launch kit',
    buttonText: 'Get Started',
    href: '/start',
    isPopular: false,
    badge: null,
  },
  {
    name: 'DAILY PLAN',
    price: 37,
    dailyPrice: 1,
    period: 'total',
    features: [
      'Everything in Pay Once',
      'Cancel anytime',
      'Auto-ends after 37 days',
      'Same £37 total',
      'Flexible payment',
    ],
    description: 'Spread the cost over time, same great value',
    buttonText: 'Get Started',
    href: '/start',
    isPopular: true,
    badge: 'FLEXIBLE',
  },
];

export default function Pricing() {
  const [showDaily, setShowDaily] = useState(false);
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const switchRef = useRef<HTMLButtonElement>(null);

  const handleToggle = (checked: boolean) => {
    setShowDaily(checked);
    if (checked && switchRef.current) {
      const rect = switchRef.current.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;

      confetti({
        particleCount: 50,
        spread: 60,
        origin: {
          x: x / window.innerWidth,
          y: y / window.innerHeight,
        },
        colors: ['#1DCD9F', '#169976', '#2dd4bf', '#5eead4'],
        ticks: 200,
        gravity: 1.2,
        decay: 0.94,
        startVelocity: 30,
        shapes: ['circle'],
      });
    }
  };

  return (
    <div className="container mx-auto px-6 lg:px-8 py-20">
      <div className="mb-12 space-y-4 text-center">
        <h2 className="text-4xl md:text-5xl font-semibold text-white tracking-tight">
          Simple, Fair Pricing
        </h2>
        <p className="text-xl text-silver-400 font-light max-w-2xl mx-auto">
          Choose the payment option that works for you
        </p>
      </div>

      <div className="mb-10 flex justify-center items-center gap-3">
        <span className={cn(
          "font-semibold transition-colors",
          !showDaily ? "text-white" : "text-silver-500"
        )}>
          Pay Once
        </span>
        <Label>
          <Switch
            ref={switchRef as any}
            checked={showDaily}
            onCheckedChange={handleToggle}
            className="relative"
          />
        </Label>
        <span className={cn(
          "font-semibold transition-colors",
          showDaily ? "text-white" : "text-silver-500"
        )}>
          Daily Billing{' '}
          <span className="text-mint-400">(Same Total)</span>
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {plans.map((plan, index) => (
          <motion.div
            key={index}
            initial={{ y: 50, opacity: 0 }}
            whileInView={
              isDesktop
                ? {
                    y: plan.isPopular ? -10 : 0,
                    opacity: 1,
                    scale: plan.isPopular ? 1.05 : 1.0,
                  }
                : { y: 0, opacity: 1 }
            }
            viewport={{ once: true }}
            transition={{
              duration: 0.8,
              type: 'spring',
              stiffness: 100,
              damping: 30,
              delay: index * 0.2,
            }}
            className={cn(
              'relative rounded-3xl p-8 backdrop-blur-sm flex flex-col',
              'bg-gradient-to-br from-charcoal-800/60 to-charcoal-900/40',
              plan.isPopular
                ? 'border-2 border-mint-500/40 shadow-xl shadow-mint-500/10'
                : 'border border-white/10'
            )}
          >
            {plan.badge && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="bg-gradient-to-r from-mint-500 to-mint-400 text-black px-5 py-1.5 rounded-full text-xs font-semibold shadow-lg tracking-wider flex items-center gap-1">
                  <Zap className="h-3 w-3 fill-current" />
                  {plan.badge}
                </span>
              </div>
            )}

            <div className="flex flex-1 flex-col">
              <p className="text-silver-400 text-base font-semibold mb-6">
                {plan.name}
              </p>

              <div className="mb-4">
                {plan.name === 'PAY ONCE' ? (
                  <>
                    <div className="flex items-baseline gap-2">
                      <span className="text-6xl font-semibold text-white tracking-tight">
                        <NumberFlow
                          value={plan.price}
                          format={{
                            style: 'currency',
                            currency: 'GBP',
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          }}
                          transformTiming={{
                            duration: 500,
                            easing: 'ease-out',
                          }}
                          willChange
                        />
                      </span>
                      <span className="text-lg font-light text-silver-400">
                        /{plan.period}
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-baseline gap-2">
                      <span className="text-6xl font-semibold text-white tracking-tight">
                        <NumberFlow
                          value={plan.dailyPrice}
                          format={{
                            style: 'currency',
                            currency: 'GBP',
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          }}
                          transformTiming={{
                            duration: 500,
                            easing: 'ease-out',
                          }}
                          willChange
                        />
                      </span>
                      <span className="text-lg font-light text-silver-400">/day × 37</span>
                    </div>
                  </>
                )}
              </div>

              <p className="text-silver-400 mb-10 font-light">
                {plan.description}
              </p>

              <ul className="space-y-4 mb-12 flex-1">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-mint-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="h-3 w-3 text-mint-400" />
                    </div>
                    <span className="text-silver-300 text-sm font-light">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                prefetch={false}
                href={plan.href}
                className={cn(
                  buttonVariants({
                    variant: plan.isPopular ? 'primary' : 'outline',
                  }),
                  'w-full text-lg font-medium tracking-tight',
                  plan.isPopular
                    ? 'shadow-lg shadow-mint-500/25 hover:shadow-mint-500/40'
                    : 'hover:border-mint-500/40'
                )}
              >
                {plan.buttonText}
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

