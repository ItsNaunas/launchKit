'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { KitNavigation } from '@/components/KitNavigation';
import { ALL_TEMPLATES, type TemplateConfig } from '@/lib/website-templates';
import { Globe, ArrowRight, Check } from 'lucide-react';

export default function WebsiteTemplatePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [kitId, setKitId] = useState<string>('');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [existingWebsites, setExistingWebsites] = useState<any[]>([]);

  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params;
      setKitId(resolvedParams.id);
    };
    resolveParams();
  }, [params]);

  useEffect(() => {
    if (!kitId) return;
    
    // Fetch existing websites
    fetch(`/api/kits/${kitId}/generate-website`)
      .then(res => res.json())
      .then(data => {
        if (data.websites) {
          setExistingWebsites(data.websites);
        }
      })
      .catch(console.error);
  }, [kitId]);

  const handleGenerateWebsite = async () => {
    if (!selectedTemplate || !kitId) return;

    setIsGenerating(true);
    try {
      const response = await fetch(`/api/kits/${kitId}/generate-website`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ templateId: selectedTemplate }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || errorData.error || 'Failed to generate website');
      }

      const data = await response.json();
      
      // Navigate to the editor
      router.push(`/kit/${kitId}/website/${data.website.id}`);
    } catch (error) {
      console.error('Error generating website:', error);
      alert('Failed to generate website. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <KitNavigation kitId={kitId} currentPage="website" />
      
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Globe className="h-8 w-8 text-blue-600" />
                Choose Your Website Template
              </h1>
              <p className="text-gray-600 mt-2">
                Select a template and we'll populate it with your business content using AI
              </p>
            </div>
            {selectedTemplate && (
              <Button
                size="lg"
                onClick={handleGenerateWebsite}
                disabled={isGenerating}
                className="flex items-center gap-2"
              >
                {isGenerating ? (
                  <>Generating Website...</>
                ) : (
                  <>
                    Generate Website
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Existing Websites */}
        {existingWebsites.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Websites</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {existingWebsites.map((website) => (
                <div
                  key={website.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => router.push(`/kit/${kitId}/website/${website.id}`)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 capitalize">
                        {website.template_id.replace(/-/g, ' ')}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Version {website.version}
                      </p>
                    </div>
                    {website.is_published && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        Published
                      </span>
                    )}
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    Edit Website
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Template Categories */}
        <div className="space-y-12">
          {(['landing', 'portfolio', 'business', 'ecommerce', 'saas'] as const).map(category => {
            const templates = ALL_TEMPLATES.filter(t => t.category === category);
            if (templates.length === 0) return null;

            return (
              <div key={category}>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 capitalize">
                  {category} Templates
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {templates.map((template) => (
                    <TemplateCard
                      key={template.id}
                      template={template}
                      isSelected={selectedTemplate === template.id}
                      onSelect={() => setSelectedTemplate(template.id)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function TemplateCard({
  template,
  isSelected,
  onSelect,
}: {
  template: TemplateConfig;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <div
      className={`group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer border-2 ${
        isSelected ? 'border-blue-600 ring-2 ring-blue-600' : 'border-transparent'
      }`}
      onClick={onSelect}
    >
      {/* Template Preview */}
      <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
        {/* Placeholder for template preview */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${template.defaultColors.primary}, ${template.defaultColors.secondary})`,
            opacity: 0.1,
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <Globe className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500">Preview</p>
          </div>
        </div>
        
        {/* Source Badge */}
        <div className="absolute top-3 right-3">
          <span className={`px-2 py-1 text-xs rounded-full ${
            template.source === 'built-in'
              ? 'bg-mint-100 text-mint-800'
              : 'bg-mint-100 text-mint-800'
          }`}>
            {template.source === 'built-in' ? 'Built-in' : 'GitHub'}
          </span>
        </div>

        {/* Selection Indicator */}
        {isSelected && (
          <div className="absolute top-3 left-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <Check className="h-5 w-5 text-white" />
            </div>
          </div>
        )}
      </div>

      {/* Template Info */}
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {template.name}
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          {template.description}
        </p>

        {/* Color Preview */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs text-gray-500">Colors:</span>
          <div className="flex gap-1">
            {Object.values(template.defaultColors).slice(0, 5).map((color, i) => (
              <div
                key={i}
                className="w-6 h-6 rounded-full border border-gray-200"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </div>

        {/* Sections */}
        <div>
          <span className="text-xs text-gray-500">Sections:</span>
          <div className="flex flex-wrap gap-1 mt-1">
            {template.sections.slice(0, 3).map((section) => (
              <span
                key={section}
                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
              >
                {section}
              </span>
            ))}
            {template.sections.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                +{template.sections.length - 3} more
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Hover Effect */}
      <div className="absolute inset-0 bg-blue-600 opacity-0 group-hover:opacity-5 transition-opacity pointer-events-none" />
    </div>
  );
}

