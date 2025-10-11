'use client';

import { useState, useEffect } from 'react';
import { WebsiteEditor } from '@/components/WebsiteEditor';
import { KitNavigation } from '@/components/KitNavigation';
import { useRouter } from 'next/navigation';

export default function WebsiteEditorPage({ 
  params 
}: { 
  params: Promise<{ id: string; websiteId: string }> 
}) {
  const router = useRouter();
  const [kitId, setKitId] = useState<string>('');
  const [websiteId, setWebsiteId] = useState<string>('');
  const [website, setWebsite] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params;
      setKitId(resolvedParams.id);
      setWebsiteId(resolvedParams.websiteId);
    };
    resolveParams();
  }, [params]);

  useEffect(() => {
    if (!kitId || !websiteId) return;

    const fetchWebsite = async () => {
      try {
        const response = await fetch(`/api/kits/${kitId}/websites/${websiteId}`);
        if (!response.ok) throw new Error('Failed to fetch website');
        
        const data = await response.json();
        setWebsite(data.website);
      } catch (error) {
        console.error('Error fetching website:', error);
        alert('Failed to load website');
        router.push(`/kit/${kitId}/website`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWebsite();
  }, [kitId, websiteId, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading editor...</p>
        </div>
      </div>
    );
  }

  if (!website) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Website not found</h1>
          <p className="text-gray-600 mt-2">The website you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      <KitNavigation kitId={kitId} currentPage="editor" />
      <div className="flex-1 overflow-hidden">
        <WebsiteEditor
          websiteId={websiteId}
          kitId={kitId}
          initialHtml={website.html_content}
          initialConfig={website.config}
          onSave={(html, config) => {
            console.log('Website saved:', { html, config });
          }}
        />
      </div>
    </div>
  );
}

