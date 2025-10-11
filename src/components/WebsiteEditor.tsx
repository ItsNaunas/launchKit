'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { DeploymentPanel } from '@/components/DeploymentPanel';
import { 
  Download, 
  Eye, 
  Code, 
  Palette, 
  Type, 
  Layout,
  Save,
  Undo,
  Redo,
  Monitor,
  Smartphone,
  Settings
} from 'lucide-react';

interface WebsiteEditorProps {
  websiteId: string;
  kitId: string;
  initialHtml: string;
  initialConfig: any;
  onSave?: (html: string, config: any) => void;
}

type ViewMode = 'desktop' | 'mobile';
type EditorTab = 'design' | 'code' | 'settings';

interface CustomizationOptions {
  fontFamily: string;
  fontSize: string;
  containerWidth: string;
  spacing: string;
  borderRadius: string;
  shadows: string;
  animations: boolean;
  showNav: boolean;
  showStats: boolean;
  showTestimonials: boolean;
  showPricing: boolean;
  showFAQ: boolean;
}

export function WebsiteEditor({ 
  websiteId, 
  kitId, 
  initialHtml, 
  initialConfig,
  onSave 
}: WebsiteEditorProps) {
  const [html, setHtml] = useState(initialHtml);
  const [config, setConfig] = useState(initialConfig);
  const [customization, setCustomization] = useState<CustomizationOptions>({
    fontFamily: 'modern',
    fontSize: 'normal',
    containerWidth: 'normal',
    spacing: 'normal',
    borderRadius: 'medium',
    shadows: 'soft',
    animations: true,
    showNav: true,
    showStats: true,
    showTestimonials: true,
    showPricing: false,
    showFAQ: false,
  });
  const [viewMode, setViewMode] = useState<ViewMode>('desktop');
  const [activeTab, setActiveTab] = useState<EditorTab>('design');
  const [isSaving, setIsSaving] = useState(false);
  const [history, setHistory] = useState<string[]>([initialHtml]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Update iframe when HTML changes
  useEffect(() => {
    if (iframeRef.current) {
      const iframe = iframeRef.current;
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (doc) {
        doc.open();
        doc.write(html);
        doc.close();
        
        // Apply customizations to the document
        applyCustomizations(doc);
        
        // Make elements editable in design mode
        if (activeTab === 'design') {
          doc.body.contentEditable = 'true';
          doc.designMode = 'on';
          
          // Track changes
          doc.addEventListener('input', handleIframeEdit);
        }
      }
    }
  }, [html, activeTab]);

  // Apply customizations when they change
  useEffect(() => {
    if (iframeRef.current?.contentDocument) {
      applyCustomizations(iframeRef.current.contentDocument);
    }
  }, [customization]);

  // Function to apply customizations to the iframe document
  const applyCustomizations = (doc: Document) => {
    const root = doc.documentElement;
    
    // Font families
    const fonts = {
      modern: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      classic: 'Georgia, "Times New Roman", serif',
      bold: '"Inter", "Helvetica Neue", Arial, sans-serif',
      elegant: '"Playfair Display", Georgia, serif',
    };
    root.style.setProperty('--font-main', fonts[customization.fontFamily as keyof typeof fonts]);

    // Container widths
    const widths = {
      narrow: '960px',
      normal: '1200px',
      wide: '1400px',
      full: '100%',
    };
    root.style.setProperty('--max-width', widths[customization.containerWidth as keyof typeof widths]);

    // Border radius
    const radius = {
      none: '0',
      small: '4px',
      medium: '12px',
      large: '20px',
    };
    root.style.setProperty('--radius', radius[customization.borderRadius as keyof typeof radius]);

    // Shadows
    const shadows = {
      none: 'none',
      soft: '0 10px 30px rgba(0,0,0,0.1)',
      strong: '0 20px 60px rgba(0,0,0,0.3)',
    };
    root.style.setProperty('--shadow', shadows[customization.shadows as keyof typeof shadows]);

    // Toggle sections visibility
    const nav = doc.querySelector('nav');
    if (nav) nav.style.display = customization.showNav ? 'block' : 'none';

    const stats = doc.querySelector('[data-section="stats"]');
    if (stats) (stats as HTMLElement).style.display = customization.showStats ? 'block' : 'none';

    const testimonials = doc.querySelector('[data-section="testimonials"]');
    if (testimonials) (testimonials as HTMLElement).style.display = customization.showTestimonials ? 'block' : 'none';
  };

  const handleIframeEdit = () => {
    if (iframeRef.current?.contentDocument) {
      const newHtml = iframeRef.current.contentDocument.documentElement.innerHTML;
      addToHistory(newHtml);
    }
  };

  const addToHistory = (newHtml: string) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newHtml);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setHtml(newHtml);
  };

  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setHtml(history[newIndex]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setHtml(history[newIndex]);
    }
  };

  const handleColorChange = (key: string, value: string) => {
    const newConfig = { ...config, [key]: value };
    setConfig(newConfig);
    
    // Update CSS variables in iframe
    if (iframeRef.current?.contentDocument) {
      const doc = iframeRef.current.contentDocument;
      const root = doc.documentElement;
      root.style.setProperty(`--color-${key}`, value);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/kits/${kitId}/websites/${websiteId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ html, config }),
      });

      if (!response.ok) throw new Error('Failed to save');
      
      if (onSave) {
        onSave(html, config);
      }
      
      alert('Website saved successfully!');
    } catch (error) {
      alert('Failed to save website');
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = () => {
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `website-${kitId}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Top Toolbar */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Undo/Redo */}
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={undo}
                disabled={historyIndex === 0}
                title="Undo"
              >
                <Undo className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={redo}
                disabled={historyIndex === history.length - 1}
                title="Redo"
              >
                <Redo className="h-4 w-4" />
              </Button>
            </div>

            {/* View Mode */}
            <div className="flex items-center gap-1 border-l pl-4">
              <Button
                variant={viewMode === 'desktop' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('desktop')}
              >
                <Monitor className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'mobile' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('mobile')}
              >
                <Smartphone className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
            >
              <Download className="h-4 w-4 mr-2" />
              Export HTML
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={isSaving}
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Editor Controls */}
        <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              className={`flex-1 px-4 py-3 text-sm font-medium ${
                activeTab === 'design'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              onClick={() => setActiveTab('design')}
            >
              <Palette className="h-4 w-4 inline mr-2" />
              Design
            </button>
            <button
              className={`flex-1 px-4 py-3 text-sm font-medium ${
                activeTab === 'code'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              onClick={() => setActiveTab('code')}
            >
              <Code className="h-4 w-4 inline mr-2" />
              Code
            </button>
            <button
              className={`flex-1 px-4 py-3 text-sm font-medium ${
                activeTab === 'settings'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              onClick={() => setActiveTab('settings')}
            >
              <Settings className="h-4 w-4 inline mr-2" />
              Settings
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-4">
            {activeTab === 'design' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Colors</h3>
                  <div className="space-y-3">
                    {Object.entries(config).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <label className="text-sm text-gray-700 capitalize">
                          {key.replace(/_/g, ' ')}
                        </label>
                        <input
                          type="color"
                          value={value as string}
                          onChange={(e) => handleColorChange(key, e.target.value)}
                          className="w-12 h-8 rounded border border-gray-300 cursor-pointer"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Typography</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Font Style</label>
                      <select 
                        value={customization.fontFamily}
                        onChange={(e) => setCustomization({...customization, fontFamily: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="modern">Modern (Sans-serif)</option>
                        <option value="classic">Classic (Serif)</option>
                        <option value="bold">Bold (Inter)</option>
                        <option value="elegant">Elegant (Playfair)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Font Size</label>
                      <select 
                        value={customization.fontSize}
                        onChange={(e) => setCustomization({...customization, fontSize: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="compact">Compact</option>
                        <option value="normal">Normal</option>
                        <option value="large">Large</option>
                      </select>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    ✨ Click on any text in preview to edit directly
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Layout</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Container Width</label>
                      <select 
                        value={customization.containerWidth}
                        onChange={(e) => setCustomization({...customization, containerWidth: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="narrow">Narrow (960px)</option>
                        <option value="normal">Normal (1200px)</option>
                        <option value="wide">Wide (1400px)</option>
                        <option value="full">Full Width</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Spacing</label>
                      <select 
                        value={customization.spacing}
                        onChange={(e) => setCustomization({...customization, spacing: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="tight">Tight</option>
                        <option value="normal">Normal</option>
                        <option value="relaxed">Relaxed</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Border Radius</label>
                      <select 
                        value={customization.borderRadius}
                        onChange={(e) => setCustomization({...customization, borderRadius: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="none">None (Square)</option>
                        <option value="small">Small (4px)</option>
                        <option value="medium">Medium (12px)</option>
                        <option value="large">Large (20px)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Visual Effects</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Shadows</label>
                      <select 
                        value={customization.shadows}
                        onChange={(e) => setCustomization({...customization, shadows: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="none">None (Flat)</option>
                        <option value="soft">Soft Shadows</option>
                        <option value="strong">Strong Shadows</option>
                      </select>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={customization.animations}
                        onChange={(e) => setCustomization({...customization, animations: e.target.checked})}
                        className="w-4 h-4" 
                      />
                      <span className="text-sm text-gray-700">Enable Animations</span>
                    </label>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Sections</h3>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={customization.showNav}
                        onChange={(e) => setCustomization({...customization, showNav: e.target.checked})}
                        className="w-4 h-4" 
                      />
                      <span className="text-sm text-gray-700">Show Navigation</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={customization.showStats}
                        onChange={(e) => setCustomization({...customization, showStats: e.target.checked})}
                        className="w-4 h-4" 
                      />
                      <span className="text-sm text-gray-700">Show Stats Section</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={customization.showTestimonials}
                        onChange={(e) => setCustomization({...customization, showTestimonials: e.target.checked})}
                        className="w-4 h-4" 
                      />
                      <span className="text-sm text-gray-700">Show Testimonials</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={customization.showPricing}
                        onChange={(e) => setCustomization({...customization, showPricing: e.target.checked})}
                        className="w-4 h-4" 
                      />
                      <span className="text-sm text-gray-700">Show Pricing Table</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={customization.showFAQ}
                        onChange={(e) => setCustomization({...customization, showFAQ: e.target.checked})}
                        className="w-4 h-4" 
                      />
                      <span className="text-sm text-gray-700">Show FAQ Section</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'code' && (
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">HTML Code</h3>
                <textarea
                  value={html}
                  onChange={(e) => setHtml(e.target.value)}
                  className="w-full h-96 p-3 font-mono text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  spellCheck={false}
                />
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">SEO Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Website Title
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                        placeholder="My Awesome Website"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Meta Description
                      </label>
                      <textarea
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                        rows={3}
                        placeholder="Description for SEO..."
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <DeploymentPanel
                    kitId={kitId}
                    websiteId={websiteId}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Preview Area */}
        <div className="flex-1 bg-gray-100 p-6 overflow-auto">
          <div
            className={`mx-auto bg-white shadow-2xl transition-all duration-300 ${
              viewMode === 'mobile' ? 'max-w-md' : 'w-full'
            }`}
            style={{ minHeight: '600px' }}
          >
            <iframe
              ref={iframeRef}
              className="w-full h-full"
              style={{ minHeight: '600px', border: 'none' }}
              title="Website Preview"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

