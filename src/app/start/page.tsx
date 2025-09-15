'use client';

import { useState } from 'react';
import { IntakeForm } from '@/components/IntakeForm';
import { type IntakeFormData } from '@/lib/schemas';

export default function StartPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: IntakeFormData) => {
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
      
      // Redirect to payment/preview page
      window.location.href = `/kit/${kitId}/preview`;
    } catch (error) {
      console.error('Error creating kit:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <IntakeForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
}
