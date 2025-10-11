'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Globe, Download, ExternalLink, Upload, CheckCircle, AlertCircle } from 'lucide-react';

interface DeploymentPanelProps {
  kitId: string;
  websiteId: string;
  currentUrl?: string;
  isPublished?: boolean;
}

export function DeploymentPanel({
  kitId,
  websiteId,
  currentUrl,
}: DeploymentPanelProps) {
  const [deploying, setDeploying] = useState(false);
  const [deploymentUrl, setDeploymentUrl] = useState(currentUrl);

  const handleDeploy = async (provider: 'netlify' | 'vercel') => {
    setDeploying(true);
    try {
      const response = await fetch(`/api/kits/${kitId}/websites/${websiteId}/deploy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider }),
      });

      const data = await response.json();

      if (data.requiresSetup) {
        alert(data.error);
        return;
      }

      if (!response.ok) throw new Error(data.error);

      setDeploymentUrl(data.url);
      alert(`Successfully deployed to ${provider}!`);
    } catch (error) {
      console.error('Deployment error:', error);
      alert('Failed to deploy website');
    } finally {
      setDeploying(false);
    }
  };

  const handleExportHTML = async () => {
    try {
      const response = await fetch(`/api/kits/${kitId}/websites/${websiteId}/deploy`);
      const data = await response.json();

      // Create a complete HTML file with embedded CSS
      const fullHTML = `<!DOCTYPE html>${data.html}`;
      
      const blob = new Blob([fullHTML], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `website-${kitId}.html`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export website');
    }
  };

  const handleExportPackage = async () => {
    try {
      const response = await fetch(`/api/kits/${kitId}/websites/${websiteId}/deploy`);
      const data = await response.json();

      // Create index.html
      const _indexHTML = `<!DOCTYPE html>${data.html}`;
      
      // Create styles.css if there's custom CSS
      const _stylesCSS = data.css || '/* No custom styles */';

      // Create a README
      const _readme = `# Your LaunchKit Website

## Files
- index.html - Main website file
- styles.css - Custom styles
- config.json - Color and configuration settings

## Deployment Instructions

### Option 1: Netlify (Recommended)
1. Go to https://app.netlify.com/drop
2. Drag and drop this folder
3. Your site is live!

### Option 2: Vercel
1. Go to https://vercel.com/new
2. Import this folder
3. Deploy!

### Option 3: GitHub Pages
1. Create a new repository
2. Upload these files
3. Enable GitHub Pages in settings

## Need Help?
Contact LaunchKit AI support for assistance.
`;

      // Create config.json
      const _configJSON = JSON.stringify(data.config, null, 2);

      // Create a zip-like package (simplified - just show files to download)
      alert('Package export coming soon! For now, use "Export HTML" to get your website file.');
      
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export package');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
          <Globe className="h-5 w-5 text-blue-600" />
          Publish & Deploy
        </h3>
        <p className="text-sm text-gray-600">
          Export your website or deploy it instantly to the web
        </p>
      </div>

      {/* Deployment Status */}
      {deploymentUrl && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-green-900 mb-1">
                Website is live!
              </p>
              <a
                href={deploymentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-green-700 hover:text-green-800 flex items-center gap-1"
              >
                {deploymentUrl}
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Export Options */}
      <div className="space-y-3 mb-6">
        <h4 className="text-sm font-medium text-gray-700">Export</h4>
        
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={handleExportHTML}
        >
          <Download className="h-4 w-4 mr-2" />
          Export as HTML
          <span className="ml-auto text-xs text-gray-500">Single file</span>
        </Button>

        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={handleExportPackage}
        >
          <Download className="h-4 w-4 mr-2" />
          Export Complete Package
          <span className="ml-auto text-xs text-gray-500">HTML + CSS + Assets</span>
        </Button>
      </div>

      {/* Deploy Options */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-700">One-Click Deploy</h4>
        
        <Button
          variant="primary"
          className="w-full justify-start bg-teal-600 hover:bg-teal-700"
          onClick={() => handleDeploy('netlify')}
          disabled={deploying}
        >
          <Upload className="h-4 w-4 mr-2" />
          {deploying ? 'Deploying...' : 'Deploy to Netlify'}
          <span className="ml-auto text-xs opacity-75">Free hosting</span>
        </Button>

        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={() => handleDeploy('vercel')}
          disabled={deploying}
        >
          <Upload className="h-4 w-4 mr-2" />
          Deploy to Vercel
          <span className="ml-auto text-xs text-gray-500">Coming soon</span>
        </Button>
      </div>

      {/* Help Text */}
      <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded">
        <div className="flex items-start gap-2">
          <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
          <p className="text-xs text-blue-800">
            <strong>Pro tip:</strong> Export your website and upload to any hosting provider,
            or use one-click deploy for instant publishing.
          </p>
        </div>
      </div>
    </div>
  );
}

