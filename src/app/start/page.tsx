'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { SimpleIntakeForm } from '@/components/SimpleIntakeForm';
import { type SimpleIntakeData } from '@/lib/validation';

export default function StartPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [initialIdea, setInitialIdea] = useState('');
  const searchParams = useSearchParams();

  useEffect(() => {
    const idea = searchParams.get('idea');
    if (idea) {
      setInitialIdea(decodeURIComponent(idea));
    }
  }, [searchParams]);

  const handleSubmit = async (data: SimpleIntakeData) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/kits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create kit');
      }

      const { kitId } = await response.json();
      
      // Redirect to teaser flow
      window.location.href = `/kit/${kitId}/teaser`;
    } catch (error) {
      console.error('Error creating kit:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Cinematic Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Subtle gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal-900/30 via-black to-black"></div>
        
        {/* Soft animated orbs - subtle and elegant */}
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-gold-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-silver-400/3 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        {/* Noise texture overlay - very subtle */}
        <div className="absolute inset-0 opacity-[0.02] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')]"></div>
      </div>

      <div className="relative z-10 py-16">
        <SimpleIntakeForm 
          onSubmit={handleSubmit} 
          isLoading={isLoading}
          defaultValues={{ business_idea: initialIdea }}
        />
      </div>
    </div>
  );
}
