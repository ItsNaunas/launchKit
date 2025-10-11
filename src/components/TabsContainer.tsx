'use client';

import { useState } from 'react';
import { CheckCircle, Circle } from 'lucide-react';

export type TabKey = 'business_case' | 'content_strategy' | 'website';

interface Tab {
  key: TabKey;
  label: string;
  isComplete: boolean;
}

interface TabsContainerProps {
  tabs: Tab[];
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  children: React.ReactNode;
}

export function TabsContainer({ tabs, activeTab, onTabChange, children }: TabsContainerProps) {
  return (
    <div className="min-h-screen bg-black">
      {/* Tab Navigation */}
      <div className="bg-charcoal-900/50 border-b border-white/10 sticky top-0 z-40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1">
            {tabs.map((tab, index) => (
              <button
                key={tab.key}
                onClick={() => onTabChange(tab.key)}
                className={`
                  relative px-8 py-5 text-sm font-medium transition-all duration-300
                  ${activeTab === tab.key 
                    ? 'text-white' 
                    : 'text-silver-500 hover:text-silver-300'
                  }
                `}
              >
                {/* Tab content */}
                <div className="flex items-center gap-3">
                  {/* Completion indicator */}
                  {tab.isComplete ? (
                    <CheckCircle className="h-4 w-4 text-green-400" />
                  ) : (
                    <Circle className="h-4 w-4 text-silver-600" />
                  )}
                  
                  {/* Tab label */}
                  <span>{tab.label}</span>
                  
                  {/* Step number */}
                  <span className={`
                    text-xs px-2 py-0.5 rounded-full
                    ${activeTab === tab.key 
                      ? 'bg-white/10 text-white' 
                      : 'bg-white/5 text-silver-600'
                    }
                  `}>
                    {index + 1}/3
                  </span>
                </div>
                
                {/* Active indicator bar */}
                {activeTab === tab.key && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-mint-500 to-mint-400" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </div>
    </div>
  );
}

// Progress indicator component
interface ProgressIndicatorProps {
  completedCount: number;
  totalCount: number;
}

export function ProgressIndicator({ completedCount, totalCount }: ProgressIndicatorProps) {
  return (
    <div className="bg-charcoal-900/50 border border-white/10 rounded-xl p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white">Your Progress</h3>
          <p className="text-sm text-silver-400 mt-1">
            Complete all {totalCount} sections to unlock checkout
          </p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-white">{completedCount}/{totalCount}</div>
          <div className="text-xs text-silver-500 mt-1">Sections Complete</div>
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="w-full h-2 bg-charcoal-800 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-mint-500 to-mint-400 transition-all duration-500"
          style={{ width: `${(completedCount / totalCount) * 100}%` }}
        />
      </div>
      
      {/* Call to action */}
      {completedCount < totalCount && (
        <p className="text-sm text-silver-400 mt-4 text-center">
          {totalCount - completedCount} more {totalCount - completedCount === 1 ? 'section' : 'sections'} to go!
        </p>
      )}
      {completedCount === totalCount && (
        <p className="text-sm text-green-400 mt-4 text-center flex items-center justify-center gap-2">
          <CheckCircle className="h-4 w-4" />
          Ready to checkout! All sections complete.
        </p>
      )}
    </div>
  );
}

