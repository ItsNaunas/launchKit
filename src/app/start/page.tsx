'use client';

import { useState } from 'react';
import { SimpleIntakeForm } from '@/components/SimpleIntakeForm';

interface SimpleIntakeData {
  business_idea: string;
  target_audience: string;
  main_challenge: string;
}

export default function StartPage() {
  const [isLoading, setIsLoading] = useState(false);

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
    <div className="min-h-screen bg-gray-50 py-8">
      <SimpleIntakeForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
}
