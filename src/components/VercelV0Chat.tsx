'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Textarea } from '@/components/ui/Textarea';
import { cn } from '@/lib/utils';
import { useAutoResizeTextarea } from '@/hooks/use-auto-resize-textarea';
import {
  ArrowUpIcon,
} from 'lucide-react';

export function VercelV0Chat() {
  const router = useRouter();
  const [value, setValue] = useState('');
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: 60,
    maxHeight: 200,
  });

  const handleSubmit = () => {
    if (value.trim()) {
      // Pass the business idea to the conversational intake
      router.push(`/start?idea=${encodeURIComponent(value.trim())}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col items-center space-y-8">
      <h2 className="text-3xl md:text-4xl font-clash font-semibold text-white tracking-tight">
        Tell us your business idea
      </h2>
      
      <div className="w-full">
        <div className="relative rounded-2xl border border-mint-600/20 bg-dark/40 backdrop-blur-xl transition-all duration-300 hover:border-mint-500/40">
          <div className="overflow-y-auto">
            <Textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                adjustHeight();
              }}
              onKeyDown={handleKeyDown}
              placeholder="e.g., A mobile app that connects dog owners with local dog walkers..."
              className={cn(
                'w-full px-4 py-3',
                'resize-none',
                'bg-transparent',
                'border-none',
                'text-sm text-white placeholder:text-gray-500',
                'focus:outline-none',
                'focus-visible:ring-0 focus-visible:ring-offset-0',
                'min-h-[60px]',
                'font-light tracking-tight',
              )}
              style={{
                overflow: 'hidden',
              }}
            />
          </div>

          <div className="flex items-center justify-between px-4 pb-4">
            <div className="flex items-center gap-2">
              <p className="text-xs text-gray-600">Press Enter to start</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!value.trim()}
                className={cn(
                  'flex items-center justify-center gap-2 rounded-xl px-6 py-2.5 text-sm font-medium transition-all duration-300',
                  value.trim()
                    ? 'bg-gradient-to-r from-mint-500 to-mint-600 text-white shadow-lg shadow-mint-500/25 hover:from-mint-600 hover:to-mint-700 hover:shadow-mint-500/40 hover:scale-105'
                    : 'bg-dark/60 text-gray-600 cursor-not-allowed',
                )}
              >
                <span>Start</span>
                <ArrowUpIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <p className="mt-4 text-center text-sm font-light text-gray-600">
          No credit card required • Results in minutes • No subscriptions, no hidden fees
        </p>

      </div>
    </div>
  );
}


export default VercelV0Chat;
