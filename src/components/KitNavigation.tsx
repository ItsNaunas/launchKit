'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Home, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface KitNavigationProps {
  kitId: string;
  currentPage: 'dashboard' | 'website' | 'editor';
  kitTitle?: string;
}

export function KitNavigation({ kitId, currentPage, kitTitle }: KitNavigationProps) {
  const router = useRouter();

  const pages = {
    dashboard: { label: 'Dashboard', path: `/kit/${kitId}/dashboard` },
    website: { label: 'Website Builder', path: `/kit/${kitId}/website` },
    editor: { label: 'Editor', path: null }, // No direct path, accessed from website
  };

  const goBack = () => {
    if (currentPage === 'editor') {
      router.push(`/kit/${kitId}/website`);
    } else if (currentPage === 'website') {
      router.push(`/kit/${kitId}/dashboard`);
    } else {
      router.push('/');
    }
  };

  const goToDashboard = () => {
    router.push(`/kit/${kitId}/dashboard`);
  };

  const goToHome = () => {
    router.push('/');
  };

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Back button + Breadcrumbs */}
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={goBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>

            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-sm">
              <button
                onClick={goToHome}
                className="text-gray-500 hover:text-gray-700 flex items-center gap-1"
              >
                <Home className="h-4 w-4" />
                Home
              </button>
              <span className="text-gray-400">/</span>
              
              {currentPage !== 'dashboard' && (
                <>
                  <button
                    onClick={goToDashboard}
                    className="text-gray-500 hover:text-gray-700 truncate max-w-[200px]"
                    title={kitTitle}
                  >
                    {kitTitle || 'Dashboard'}
                  </button>
                  <span className="text-gray-400">/</span>
                </>
              )}
              
              <span className="text-gray-900 font-medium">
                {pages[currentPage].label}
              </span>
            </nav>
          </div>

          {/* Right: Logo/Brand */}
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-orange-600" />
            <span className="font-semibold text-gray-900">LaunchKit AI</span>
          </div>
        </div>
      </div>
    </div>
  );
}

